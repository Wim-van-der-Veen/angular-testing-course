import { TestBed, } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, } from '@angular/common/http/testing'
import { CoursesService, } from './courses.service';
import { COURSES, LESSONS, findLessonsForCourse } from '../../../../server/db-data';
import { Course } from '../model/course';
import { LoggerService, } from './logger.service';

// xdescribe(...)  -- don't
// fdescribe(...)  -- focus
describe('CoursesService', () => {

	let httpTestingController: HttpTestingController;
	let coursesService: CoursesService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ HttpClientTestingModule, ],
			providers: [ CoursesService, ]
		});

		coursesService = TestBed.inject(CoursesService);
		httpTestingController = TestBed.inject(HttpTestingController);
	});

	it('should retrieve all courses', () => {

		coursesService.findAllCourses()
			.subscribe(courses => {

				expect(courses).toBeTruthy('No courses returned');
				expect(courses.length).toBe(12, 'incorrect number of courses');
				const course = courses.find(course => course.id === 12);
				expect(course.titles.description).toBe('Angular Testing Course');
			});

		const req = httpTestingController.expectOne('/api/courses');
		expect(req.request.method).toEqual('GET');
		req.flush({ payload: Object.values(COURSES)});
	});

	it('should retrieve a specific course (by id)', () => {

		coursesService.findCourseById(12)
			.subscribe(course => {
				expect(course).toBeTruthy('No course returned');
				expect(course.id).toBe(12, 'incorrect course id');
			});

		const req = httpTestingController.expectOne('/api/courses/12');
		expect(req.request.method).toEqual('GET');
		req.flush(COURSES[12]);
	});

	it('should save the course data', () => {

		const changes: Partial<Course> = {titles: {description: 'Testing Course'}};

		coursesService.saveCourse(12, changes)
			.subscribe(course => {
				expect(course).toBeTruthy('No course returned');
				expect(course.id).toBe(12, 'incorrect course id');
			});

		const req = httpTestingController.expectOne('/api/courses/12');
		expect(req.request.method).toEqual('PUT');
		expect(req.request.body.titles.description)
			.toEqual(changes.titles.description);
		req.flush({ ...COURSES[12], ...req.request.body });
	});

	it('should give an error if save course data fails', () => {

		const changes: Partial<Course> = {titles: {description: 'Testing Course'}};

		coursesService.saveCourse(12, changes)
			.subscribe(
				course => {
					fail('the save course operation should have failed');
				}, 
				error => {
					expect(error.status).toBe(500, 'Wrong fail code');
				}
			);

		const req = httpTestingController.expectOne('/api/courses/12');
		expect(req.request.method).toEqual('PUT');
		req.flush('Save course failed', {status: 500, statusText: 'Internal Server Error'});
	});

	it('should find a list of lessons', () => {

		const changes: Partial<Course> = {titles: {description: 'Testing Course'}};

		coursesService.findLessons(12)
			.subscribe(lessons => {
				expect(lessons).toBeTruthy('No lessons returned');
				expect(lessons.length).toBe(3, 'incorrect number of lessons');
			});

		// const req = httpTestingController.expectOne('/api/lessons?courseId=12&pageNumber=0');
		const req = httpTestingController.expectOne(req => req.url === '/api/lessons');
		expect(req.request.method).toEqual('GET');
		expect(req.request.params.get('courseId'))  .toEqual('12');
		expect(req.request.params.get('filter'))    .toEqual('');
		expect(req.request.params.get('sortOrder')) .toEqual('asc');
		expect(req.request.params.get('pageNumber')).toEqual('0');
		expect(req.request.params.get('pageSize'))  .toEqual('3');
		req.flush({ payload: findLessonsForCourse(12).slice(0, 3) });
	});

	afterEach(() => {
		httpTestingController.verify();
	});
});

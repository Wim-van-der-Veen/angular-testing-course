/*
* @Author: Wim van der Veen
* @Date:   2021-07-26 11:49:15
* @Last Modified by:   Wim van der Veen
* @Last Modified time: 2021-07-26 13:28:16
*/

// initially: no backend, yes frontend, open browser to localhost:4200
// take car of cypress.json containing baseurl localhost:4200
// npm run cypress:open

describe('Home Page', () => {

	beforeEach(() => {

		cy.server();
		cy.fixture('courses.json').as('coursesJSON');
		cy.route('/api/courses', '@coursesJSON').as('courses');

		cy.visit('/');

	});

	it('should display a list of courses', () => {

		cy.contains('All Courses');
		cy.wait('@courses')

		cy.get('mat-card').should('have.length', 9);
	});


	it('should display the advanced courses', () => {
		cy.get('.mat-tab-label').should('have.length', 2);

		cy.get('.mat-tab-label').last().click();

		cy.get('.mat-tab-body-active .mat-card-title').should('have.length', 3);
		cy.get('.mat-tab-body-active .mat-card-title').first().should('contain', 'Angular Security Course');
	});
});
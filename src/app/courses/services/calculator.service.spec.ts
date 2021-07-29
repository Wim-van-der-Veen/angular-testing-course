import { TestBed } from '@angular/core/testing';
import { CalculatorService } from './calculator.service';
import { LoggerService } from './logger.service';

// xdescribe(...)  -- don't
// fdescribe(...)  -- focus
describe('CalculatorService', () => {

	let loggerSpy: any;
	let calculator: CalculatorService;

	beforeEach(() => {
		// logger = new LoggerService();
		// spyOn(logger, 'log');
		// calculator = new CalculatorService(logger);
		// !! better use a jasmine fake logger, to avoid testing the LoggerService here

		loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);
		TestBed.configureTestingModule({
			providers: [
				CalculatorService,
				{ provide: LoggerService, useValue: loggerSpy },
			]
		});
		calculator = TestBed.inject(CalculatorService);
	});

	it('should add two numbers', () => {
		const result = calculator.add(2, 3);
		expect(result).toBe(5, 'unexpected calculation result');
		expect(loggerSpy.log).toHaveBeenCalledTimes(1);
	});

	// xit(...)
	// fit(...)
	it('should subtract two numbers', () => {
		const result = calculator.subtract(2, 3);
		expect(result).toBe(-1, 'unexpected calculation result');
		expect(loggerSpy.log).toHaveBeenCalledTimes(1);
	});

});
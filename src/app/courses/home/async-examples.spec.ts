import { fakeAsync, tick, flush, flushMicrotasks } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

describe('async testing examples', () => {

	it('asynchronous test example - setTimeout()', () => {
		let test = false;
		setTimeout(() => {
			test = true;
			expect(test).toBeTruthy();
			// should finish with remarks about missing expectations
		}, 100);
	});

	it('asynchronous test example - Jasmine done()', (done: DoneFn) => {
		let test = false;
		setTimeout(() => {
			test = true;
			expect(test).toBeTruthy();
			done();
		}, 110);
		expect(test).toBeFalsy();
	});

	it('asynchronous test example - Jasmine fakeAsync()', fakeAsync(() => {
		let test = false;
		setTimeout(() => {}, 350);
		setTimeout(() => {
			test = true;
			expect(test).toBeTruthy();
		}, 120);

		tick(119);
		expect(test).toBeFalsy();
		tick(1);
		expect(test).toBeTruthy();

		flush();
	}));

	it('asynchronous test example - plain Promise', fakeAsync(() => {
		let test = false;
		Promise.resolve()
			.then(() => {
				return Promise.resolve();
			})
			.then(() => {
				test = true;
			});

		flushMicrotasks();
		expect(test).toBeTruthy();
	}));

	it('asynchronous test example - Promise + setTimeout()', fakeAsync(() => {
		let counter = 0;
		Promise.resolve()
			.then(() => {

				counter += 10;
				
				setTimeout(() => {
					counter += 1;
				}, 130);
			});

		expect(counter).toBe(0);
		flushMicrotasks();
		expect(counter).toBe(10);
		tick(100);
		expect(counter).toBe(10);
		flush();
		expect(counter).toBe(11);
	}));

	it('asynchronous test example - Observables', fakeAsync(() => {
		let test = false;

		const test$ = of(test).pipe(delay(150));
		test$.subscribe(() => {
			test = true;
		});

		tick(150);
		expect(test).toBeTruthy();
	}));

});
import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay} from 'rxjs/operators';

describe("Async Testing Examples", () => {

    it("Asynchronous test example with Jasmine done()", (done: DoneFn) => {
        
        let test = false;

        setTimeout(() => {

            console.log('running assertions');
            test = true;
            expect(test).toBeTruthy();
            done();

        }, 1000);
    });

    it("Asynchronous test example - setTimeout()", fakeAsync(() => {
        
        let test = false;

        // Variante für nur ein setTimeout
        // setTimeout(() => {

        //     console.log('running assertions');
        //     test = true;
            

        // }, 1000);

        // tick(1000);

        // Variante für mehrere setTimeouts
        setTimeout(() => {});

        setTimeout(() => {

            console.log('running assertions');
            test = true;
            

        }, 1000);

        flush();

        expect(test).toBeTruthy();
    }));

    it('Asynchronous test example - plain Promise', fakeAsync(() => {
        let test = false;

        console.log('Creating promise');

        //promise
        Promise.resolve().then(() => {
            console.log('Promise first then() evaluated successfully');
            
            return Promise.resolve();
        })
        .then(() => { console.log('Promise second then() evaluated successfully'); test = true; });

        flushMicrotasks();

        console.log('Running test assertions');
        expect(test).toBeTruthy();

        // output reihenfolge:
        //1. Creationg promise
        //2. Promise first then() evaluated successfully
        //3. Promise second then() evaluated successfully
        //4. Running test assertions
    }));

    it('Asynchronous test example - Promises + setTimeout()', fakeAsync(() => {
        let counter = 0;

        Promise.resolve()
            .then(() => {
                counter+=10;
                setTimeout(() => {
                    counter +=1;
                }, 1000);
            });
// teste diese Queeorder
            // expect(counter).toBe(0);

            // tick(1000);
            // expect(counter).toBe(11);

            // flushMicrotasks();
            // expect(counter).toBe(11);

            expect(counter).toBe(0);

            flushMicrotasks();

            expect(counter).toBe(10);

            tick(500);

            expect(counter).toBe(10);

            tick(500);

            expect(counter).toBe(11);

    }));

    it('Asynchronous test example - Observables', fakeAsync(() => {
        //funktioniert ohne fakeAsync
        // let test = false;

        // console.log('Creating Observable');

        // const test$ = of(test).pipe();

        // test$.subscribe(() => { 
        //     test = true;
        // });

        // console.log('Running test assertions');

        // expect(test).toBe(true);

        let test = false;

        console.log('Creating Observable');

        const test$ = of(test).pipe(delay(1000));  

        test$.subscribe(() => { test = true; });
        tick(1000);

        console.log('Running test assertions');

        expect(test).toBe(true);
    }));

});
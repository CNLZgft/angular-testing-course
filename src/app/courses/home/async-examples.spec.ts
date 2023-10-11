import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe("Async Testing Examples", () => {
  it("Async test example with Jasmine done()", (done: DoneFn) => {
    let test = false;

    setTimeout(() => {
      console.log("running assertions");

      test = true;

      expect(test).toBeTruthy();

      done();
    }, 1000);
  });

  //para poder hacer test asíncronos y no depender del setTimeout() y el done()
  //hay alternativas para poder usar en caso de que haya muchas llamadas asíncronas
  //en el componente a testear (ej. clicks, llamadas http...)

  //en este caso usamos fakeAsync() para simular que el test es asíncrono
  it("Async test example with setTimeout() - fakeAsync", fakeAsync(() => {
    let test = false;

    setTimeout(() => {});

    setTimeout(() => {
      console.log("running assertions setTimeout()");

      test = true;
    }, 1000);

    //para simular el paso del tiempo y asegurar la ejecución del test con setTiemout,
    //se añade el parámetro "tick" con los milisegundos necesarios
    //tick(1000);

    //otro método para simular el paso del tiempo es el "flush"
    //en este caso se asegura que todas las operaciones asíncronas se han ejecutado
    //antes de que se ejecute el "expect"

    flush();

    expect(test).toBeTruthy();
  }));

  //primero se ejecutan las "micro transactions" como las Promises
  //y luego se ejecturan las "major transactions" como los setTimeouts, que actualizan el DOM

  it("Async test example with plain Promise", fakeAsync(() => {
    let test = false;

    console.log("Creating promise");

    // setTimeout(() => {
    //   console.log("first setTimeout executed");
    // });

    // setTimeout(() => {
    //   console.log("second setTimeout executed");
    // });

    Promise.resolve()
      .then(() => {
        console.log("Promise  first then() evaluated successfully");

        return Promise.resolve();
      })
      .then(() => {
        console.log("Promise  second then() evaluated successfully");
        test = true;
      });

    //para  ejecturar las "micro transactions", en este caso las Promises,
    //antes que las validaciones se usa flushMicrotasks()
    flushMicrotasks();

    console.log("Running test assertions");

    //validación
    expect(test).toBeTruthy();
  }));

  it("Async test example with Promises and setTimeout()", fakeAsync(() => {
    let counter = 0;

    Promise.resolve().then(() => {
      counter += 10;

      setTimeout(() => {
        counter += 1;
      }, 1000);
    });

    expect(counter).toBe(0);

    flushMicrotasks();

    expect(counter).toBe(10);

    tick(500);

    expect(counter).toBe(10);

    tick(500);

    expect(counter).toBe(11);
  }));

  //si los observables son síncronos no hace falta poner el fakeAsync()
  it("Async test example with Observables", fakeAsync(() => {
    let test = false;
    console.log("Creating Observable");

    //delay() es un operador de RxJS que  equivale al setTimeout()
    const test$ = of(test).pipe(delay(1000));

    test$.subscribe(() => {
      test = true;
    });

    tick(1000);

    console.log("Running test assertions");

    expect(test).toBeTruthy();
  }));
});

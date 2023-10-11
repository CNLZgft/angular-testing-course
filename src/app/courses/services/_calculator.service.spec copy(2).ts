import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";
import { TestBed } from "@angular/core/testing";

let calculator: CalculatorService;
let loggerSpy: any;

//xdescribe --> para deshabilitar todo el conjunto de tests
//xit --> para deshabilitar un test específico
//fdescribe --> para ejecutar un sólo conjunto de tests, en el caso de que hubiera más de 1
//fit --> para ejectuar un test específico

describe("CalculatorService", () => {
  beforeEach(() => {
    console.log("calling beforeEach");

    //se hace un mock (fake dependency) del servicio LoggerService porque realmente se quiere
    //hacer unit testing del servicio CalculatorService
    //si se quisiera usar el servicio real de LoggerService entonces esto pasaría a ser
    //un Integration Test, ya que intervendrían los dos servicios así como la
    //comunicación entre ellos
    loggerSpy = jasmine.createSpyObj("LoggerService", ["log"]);

    //"TestBed" allow us to provide the dependencies to our services by using dependency
    //injection instead of calling constructors exlicitly

    //al final se basa en la dependency injection de Angular, en lugar de usar la
    //implementación de depencias por defecto de Jasmine
    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        //de esta forma se puede usar el servicio inyectándolo en la propiedad
        //"useValue"
        { provide: LoggerService, useValue: loggerSpy },
      ],
    });

    calculator = TestBed.inject(CalculatorService);
  });

  it("sould add two numbers", () => {
    console.log("add test");

    const result = calculator.add(2, 2);

    expect(result).toBe(4);

    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  it("sould substract two numbers", () => {
    console.log("substract test");

    const result = calculator.subtract(2, 2);

    expect(result).toBe(0, "unexpected substraction result");
  });
});

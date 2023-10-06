import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";
import { TestBed } from "@angular/core/testing";

let calculator: CalculatorService;
let loggerSpy: any;

describe("CalculatorService", () => {
  beforeEach(() => {
    console.log("calling beforeEach");

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

//se pone el nombre del test que se va a pogramar, en este caso "CalculatorService"
//ya que es el nombre que se le puso a la funcion describe()

import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";

//en la funcion puedes poner varias especificaciones para testear, llamado "test suite"
//y una especificación se llama "functional test"
describe("CalculatorService", () => {
  it("sould add two numbers", () => {
    //"pending()" --> para decirle a Jasmine que el test esta pendiente de implementar
    //"fail()" --> para decirle a Jasmine que el test es fallido
    //para verificar el output del test se usa [Karma] test runner

    //ahora estamos creando una nueva instancia del servicio pero
    //lo ideal es hacer implementaciones fake de las dependencias de los servicios
    //const logger = new LoggerService();

    //se puede crear un dependency fake con jasmine.createSpyObj
    //se le pasa por parametro el nombre del objeto y un array de metodos que contiene
    const logger = jasmine.createSpyObj("LoggerService", ["log"]);

    //spyOn es un objeto de Jasmine
    //en el se le pasa el objeto a espiar, en este caso el "logger", que es una instancia del servicio
    //y el metodo a espiar, en este caso "log"
    //spyOn(logger, "log");

    //preparation phase
    const calculator = new CalculatorService(logger);

    //execution phase
    const result = calculator.add(2, 2);

    //validation phase
    expect(result).toBe(4);

    expect(logger.log).toHaveBeenCalledTimes(1);
  });

  it("sould substract two numbers", () => {
    const calculator = new CalculatorService(new LoggerService());

    const result = calculator.subtract(2, 2);

    expect(result).toBe(0, "unexpected substraction result");
  });
});

//para realizar los test sin abrir una ventana de Chrome
//ng test --no-watch

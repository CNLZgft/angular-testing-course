describe("Home Page", () => {
  beforeEach(() => {
    //las partes comunes en los test se pueden poner en el beforeEach()
    cy.fixture("courses.json").as("coursesJSON");

    cy.server();

    cy.route("/api/courses", "@coursesJSON").as("courses");

    cy.visit("/");
  });

  it("should display a list of courses", () => {
    //para hacer llamadas http reales, usamos el fichero de mocking de cypress dentro de fixtures para hacer el test
    //sería como el payload que devolvería el backend al llamar a una API

    // //define the fixture accessing  the file giving an alias
    // cy.fixture("courses.json").as("coursesJSON");

    // //initialize the mock cypress backend server
    // cy.server();

    // //link the file to a route and accessing the response "coursesJSON"
    // //whenever we access to "/api/courses", this payload will be sent back "coursesJSON"
    // cy.route("/api/courses", "@coursesJSON").as("courses");

    // //root page of the application
    // cy.visit("/");

    //confirm that we are in the right page
    cy.contains("All Courses");

    //wait for the request to be completed
    cy.wait("@courses");

    //confirm that we retrieve the data, in this case the mat-cards
    cy.get("mat-card").should("have.length", 9);
  });

  it("should display advance courses", () => {
    cy.get(".mdc-tab").should("have.length", 2);

    cy.get(".mdc-tab").last().click();

    //la cantidad de cards debe ser mayor que 1
    cy.get(".mat-mdc-tab-body-active .mat-mdc-card-title")
      .its("length")
      .should("be.gt", 1);

    cy.get(".mat-mdc-tab-body-active .mat-mdc-card-title")
      .first()
      .should("contain", "Angular Security Course");
  });
});

//ng-test --watch=false --code-coverage
//para ejecturar el Angular Testing y que luego se pare despues de dar un report
//se creará la carpeta "coverage" automáticamente

//npm install -g http-server
//para obtener todos los comandos http

//cd coverage
//http-server -c-1 .
//para levantar un servidor con el contenido de la carpeta actual

//de esta forma se puede saber que partes del código están testeadas y cuáles no


//package.json
//cypress:open --> cypress open -->  para hacer el test completo (E2E) de la aplicación abriendo nueva ventana
//build:prod --> ng build --configuration=production -->  para crear el build de producción y prepararse para test de integración continua
//start:prod --> http-server ./dist -a localhost -p 4200 --> para levantar el 
//servidor en modo PRD, mismo puerto que al levantar la APP en local
//cypress:start --> cypress start --> hace el test en modo comando

//preparing application for continuous integration
//build-and-start:prod --> run-s build:prod start:prod --> para preparar la app simulando
//un entorno productivo

//e2e --> start-server-and-test build-and-start:prod http://localhost:4200 cypress:run --> de esta manera
//se preparan los test e2e de Cypress para ser deployados en integración continua


import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  waitForAsync,
} from "@angular/core/testing";
import { CoursesModule } from "../courses.module";
import { DebugElement } from "@angular/core";
import { HomeComponent } from "./home.component";
import { CoursesService } from "../services/courses.service";
import { setupCourses } from "../common/setup-test-data";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { click } from "../common/test-utils";

describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let element: DebugElement;
  let coursesService: any;
  const begginerCourses = setupCourses().filter(
    (course) => course.category === "BEGINNER"
  );
  const advancedCourses = setupCourses().filter(
    (course) => course.category === "ADVANCED"
  );

  beforeEach(waitForAsync(() => {
    const coursesServiceSpy = jasmine.createSpyObj("CoursesService", [
      "findAllCourses",
    ]);

    TestBed.configureTestingModule({
      //NoopAnimationsModule es para no incluir en el testeo cualquier módulo que
      //se use para animaciones pero que el testing siga funcionado sin que de error
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [{ provide: CoursesService, useValue: coursesServiceSpy }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
      });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display only beginner courses", () => {
    //findAllCourses devuelve un observable por lo que el valor de retorno tiene que
    //ser un observable. Se añade el operador of para convertirlo en un observable
    coursesService.findAllCourses.and.returnValue(of(begginerCourses));

    fixture.detectChanges();

    const tabs = element.queryAll(By.css(".mdc-tab"));

    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });

  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));

    fixture.detectChanges();

    const tabs = element.queryAll(By.css(".mdc-tab"));

    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });

  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = element.queryAll(By.css(".mdc-tab"));

    expect(tabs.length).toBe(2, "Expected to find 2 tabs");
  });

  //se pasa por parámetro la función "done" para hacer saber a Jasmine que se trata
  //de un test asíncrono
  it("should display advanced courses when tab clicked", fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = element.queryAll(By.css(".mdc-tab"));

    //usamos la funcion click() del fichero "test-utils.ts" para simular el
    //evento click de forma nativa
    click(tabs[1]);

    //se debe usar de nuevo el método "detectChanges()" para que se actualice el DOM
    //después del click
    fixture.detectChanges();

    flush();

    //como se produce una animación al hacer click en los tabs y no se muestran
    //los cards hasta que la animación es completada, hay que poner un delay
    //para que de tiempo a ejecutarse el nuevo DOM
    // setTimeout(() => {
    //   const cardTitles = element.queryAll(By.css(".mat-mdc-card-title"));

    //   expect(cardTitles.length).toBeGreaterThan(
    //     0,
    //     "Could not find card titles"
    //   );

    //   expect(cardTitles[0].nativeElement.textContent).toContain(
    //     "Angular Security Course"
    //   );

    //   //se invoca el "done" para que Jasmine no de por finalizado el test hasta
    //   //que pase por aquí
    //   done();
    // }, 5000);

    const cardTitles = element.queryAll(By.css(".mat-mdc-tab-body-active"));

    expect(cardTitles.length).toBeGreaterThan(0, "Could not find card titles");

    expect(cardTitles[0].nativeElement.textContent).toContain(
      "Angular Security Course"
    );
  }));

  //waitForAsync() se usa para los test con llamadas HTTP
  it("should display advanced courses when tab clicked w/waitForAsync()", waitForAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = element.queryAll(By.css(".mdc-tab"));

    click(tabs[1]);

    fixture.detectChanges();

    //whenStable() devuelve una promesa por lo que las validaciones se ejecutaran
    //cuando se resuelva
    fixture.whenStable().then(() => {
      console.log("called whenStable()");

      const cardTitles = element.queryAll(By.css(".mat-mdc-tab-body-active"));

      expect(cardTitles.length).toBeGreaterThan(
        0,
        "Could not find card titles"
      );

      expect(cardTitles[0].nativeElement.textContent).toContain(
        "Angular Security Course"
      );
    });
  }));
});

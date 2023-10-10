import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CoursesCardListComponent } from "./courses-card-list.component";
import { CoursesModule } from "../courses.module";
import { COURSES } from "../../../../server/db-data";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { sortCoursesBySeqNo } from "../home/sort-course-by-seq";
import { Course } from "../model/course";
import { setupCourses } from "../common/setup-test-data";

describe("CoursesCardListComponent", () => {
  let component: CoursesCardListComponent;

  //para crear una instancia del compoennte y poder hacer pruebas
  //is a test utility type  that is going to help us to do some common test operations
  let fixture: ComponentFixture<CoursesCardListComponent>;

  //nos permite acceder a los elementos del DOM
  let element: DebugElement;

  //waitForAsync se usa para que cualquier promesa que este dentro del bloque de
  //waitForAsync pueda realizarse antes de pasar a ejectuar el resto de código
  //de esta manera lo que este dentro del "then" podrá ejecutarse antes de pasar
  //a los unit tests
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      //en lugar de declarar todos los componentes que se usan en el HTML
      //se importa un módulo que engloba todos, en este caso "CoursesModule", ya que
      //incluye todos los módulos que se usan en "courses-card-list.component.ts"
      declarations: [],
      imports: [CoursesModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);

        component = fixture.componentInstance;
        element = fixture.debugElement;
      });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display the course list", () => {
    //setupCourses() function devuelve un listado de cursos del fichero "db-data"
    //y los ordena por "seqNo"
    component.courses = setupCourses();

    //para detectar los cambios en el DOM
    fixture.detectChanges();

    //para comprobar si el HTML tiene elementos
    //console.log(element.nativeElement.outerHTML);

    const cards = element.queryAll(By.css(".course-card"));

    expect(cards).toBeTruthy("Could not find cards");

    expect(cards.length).toBe(12, "Unexpected number of courses");
  });

  it("should display the first course", () => {
    component.courses = setupCourses();

    fixture.detectChanges();

    const course = component.courses[0];

    //first-child para determinar que es el primer elemento de la lista
    const card = element.query(By.css(".course-card:first-child"));

    const title = card.query(By.css("mat-card-title"));

    const image = card.query(By.css("img"));

    expect(card).toBeTruthy("Could not find the course card");

    expect(title.nativeElement.textContent).toBe(course.titles.description);

    expect(image.nativeElement.src).toBe(course.iconUrl);
  });
});

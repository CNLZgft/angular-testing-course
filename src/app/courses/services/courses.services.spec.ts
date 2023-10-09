import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { COURSES } from "../../../../server/db-data";
import { Course } from "../model/course";

describe("CoursesService", () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  //en este caso queremos testear "CoursesService".
  //CoursesService tiene la dependecia de "HttpClient", de esta manera tenemos que crear
  //un mock de HttpClient ya que no es el servicio principal que queremos testear
  //se consigue importanto "HttpClientTestingModule"

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });

    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it("should retrieve all courses", () => {
    coursesService.findAllCourses().subscribe((courses) => {
      expect(courses).toBeTruthy("No courses returned");

      expect(courses.length).toBe(12, "incorrect number");

      const course = courses.find((course) => course.id === 12);

      expect(course.titles.description).toBe("Angular Testing Course");
    });

    //mock http object
    const request = httpTestingController.expectOne("/api/courses");

    expect(request.request.method).toEqual("GET");

    //para obtener datos de prueba de la petición http
    //payload --> devuelve un array de cursos <-- Object.values(COURSES)
    request.flush({ payload: Object.values(COURSES) });

    //para asegurar que sólo se realiza la petición http desde el servicio que estamos
    //testeando, se usa el método "verify()"
    //httpTestingController.verify();
  });

  it("should find a course by ID", () => {
    coursesService.findCourseById(12).subscribe((course) => {
      expect(course).toBeTruthy("Course not found");

      expect(course.id).toBe(12, "ID doesn't exist");
    });

    const request = httpTestingController.expectOne("/api/courses/12");

    expect(request.request.method).toEqual("GET");

    request.flush(COURSES[12]);
  });

  it("should save the course data", () => {
    const changes: Partial<Course> = {
      titles: { description: "Testing Course" },
    };

    coursesService.saveCourse(12, changes).subscribe((course) => {
      expect(course.id).toBe(12, "ID doesn't exist");
    });

    const request = httpTestingController.expectOne("/api/courses/12");

    expect(request.request.method).toEqual("PUT");

    //para verificar que los datos se estan añadiendo a la peticion http
    //de guardado, se accede al body de la peticion junto con la
    //property del objeto a validar
    expect(request.request.body.titles.description).toEqual(
      changes.titles.description
    );

    //in response to the put request, we'll get a new object containing the data
    //of the original object 12 and the changes made to it
    request.flush({
      ...COURSES[12],
      ...changes,
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});

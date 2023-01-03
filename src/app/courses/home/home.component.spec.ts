import {async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, waitForAsync} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';
// import { test } from 'mocha';
import { utils } from 'protractor';




describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component:HomeComponent;
  let el: DebugElement;

  let coursesService: any;

  const beginnerCourses = setupCourses().filter(course => course.category === 'BEGINNER');
  const advanceCourses = setupCourses().filter(course => course.category === 'ADVANCED');


  beforeEach(waitForAsync(() => {
    const coursesServiceSpy = jasmine.createSpyObj('CoursesService',['findAllCourses']);// give them a name 'CoursesService'
    // and the method that used in this part here only 'findAllCourses'
    
    TestBed.configureTestingModule({
      imports:[
        CoursesModule, // if you have many items of modules, you could make an module such as CoursesModul to get all needed class
        NoopAnimationsModule
      ],
      providers: [
        {provide: CoursesService, useValue: coursesServiceSpy} // to override        
       ] 
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;
      coursesService = TestBed.inject(CoursesService);
    });

  }));

  it("should create the component", () => {

    expect(component).toBeTruthy();

  });


  it("should display only beginner courses", () => {

    // coursesService.findAllCourses.and.returnValue(setupCourses)
    // .filter(course => course.category == 'BEGINNER');

    // für diesen part gibt es einen Error
    // (setupCourses).filter(course => course.category == 'BEGINNER');
    // deshalb sourcen wir es out. wir geben hier eine Liste aus und kein Observable.

   
    // coursesService.findAllCourses.and.returnValue(beginnerCourses);
     // als nächstes brauchen wir Obervable

     // durch diesen of() erstellen wir ein sync observable
     // we don't need a timeout, response etc.
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));

    fixture.detectChanges();


    // const tabs = el.queryAll(By.css(".mat-tab-label"));
    //  i get an error because the css class is wrong
    // const tabs = el.queryAll(By.css(".mat-mdc-tab-labels"));// funktioniert -> es gibt nur einen also nicht richtig
    const tabs = el.queryAll(By.css(".mdc-tab__text-label"));
    // const tabs = el.queryAll(By.css(".mat-tab-labels-0-0")); // ist id kein class, funktioniert nicht
    

    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });


  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advanceCourses));

    fixture.detectChanges();
    // const tabs = el.queryAll(By.css(".mat-mdc-tab-labels"));
    const tabs = el.queryAll(By.css(".mdc-tab__text-label"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });


  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    // const tabs = el.queryAll(By.css(".mat-mdc-tab-labels")); es gibt den nur einmal im DOM
    const tabs = el.queryAll(By.css(".mdc-tab__text-label"));
    expect(tabs.length).toBe(2, "Expected to find 2 tabs");

  });


  it("should display advanced courses when tab clicked", (done: DoneFn) => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    // const tabs = el.queryAll(By.css(".mdc-tab__text-label"));
    // const tabs = el.queryAll(By.css('.mat-mdc-tab'));
    // const tabs = el.queryAll(By.css(".mat-mdc-tab-labels"));
    // die beiden Div boxes haben diese Klasse
    const tabs = el.queryAll(By.css(".mdc-tab.mat-mdc-tab"));    

    //el.nativeElement.click();
    //or 
    //test-utils.ts => click()
    click(tabs[1]);
    // // nochmal nach der Änderung
    fixture.detectChanges();
    
    //wir wollen jetzt das dieser part in einem setTimeout also einem async form übergeht und ausgeführt werden soll beim test start
    setTimeout(() => {
      // class="mat-mdc-tab-body ng-tns-c41-1 ng-star-inserted mat-mdc-tab-body-active"
      const cardIitle = el.queryAll(By.css(".mat-mdc-tab-body-active .mat-mdc-card-title"));
      expect(cardIitle.length).toBeGreaterThan(0, "Could not find card titles");
      expect(cardIitle[0].nativeElement.textContent).toContain("Angular Security Course");
      done();
    }, 500);
    // const cardIitle = el.queryAll(By.css(".mat-mdc-tab-body-active .mat-mdc-card-title"));
    // expect(cardIitle.length).toBeGreaterThan(0, "Could not find card titles");
    // expect(cardIitle[0].nativeElement.textContent).toContain("Angular Security Course");
  });

  it("should display advanced courses when tab clicked by fakeAsync", fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    // die beiden Div boxes haben diese Klasse
    const tabs = el.queryAll(By.css(".mdc-tab.mat-mdc-tab"));    

    click(tabs[1]);
    fixture.detectChanges();

    flush(); // empty the task queue
    
    //wir wollen jetzt das dieser part in einem setTimeout also einem async form übergeht und ausgeführt werden soll beim test start
    // class="mat-mdc-tab-body ng-tns-c41-1 ng-star-inserted mat-mdc-tab-body-active"
    const cardIitle = el.queryAll(By.css(".mat-mdc-tab-body-active .mat-mdc-card-title"));
    expect(cardIitle.length).toBeGreaterThan(0, "Could not find card titles");
    expect(cardIitle[0].nativeElement.textContent).toContain("Angular Security Course");
  }));

  it("should display advanced courses when tab clicked - waitForAsync", waitForAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mdc-tab.mat-mdc-tab"));    

    click(tabs[1]);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      console.log("called whenStable()");
      const cardIitle = el.queryAll(By.css(".mat-mdc-tab-body-active .mat-mdc-card-title"));
      expect(cardIitle.length).toBeGreaterThan(0, "Could not find card titles");
      expect(cardIitle[0].nativeElement.textContent).toContain("Angular Security Course");
    });
    
  }));

});



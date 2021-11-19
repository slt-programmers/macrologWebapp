import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatepickerComponent } from './datepicker.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, QueryList } from '@angular/core';
import { of } from 'rxjs';


describe('DatepickerComponent', () => {
  let component: DatepickerComponent;
  let fixture: ComponentFixture<DatepickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatepickerComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
    fixture = TestBed.createComponent(DatepickerComponent);
    component = fixture.componentInstance;
    component.dayRefs = {changes: of([]) as any} as QueryList<any>;
    fixture.detectChanges();
  });

  it('should create datepicker', () => {
    component.ngAfterViewInit();
    expect(component).toBeTruthy();
  });

  it('should open', () => {
    component.ngAfterViewInit();
    component.toggleOpen();
    expect(component.isOpen).toBeTrue();
  });

  it('should set next day', () => {
    component.ngAfterViewInit();
    component.toggleOpen();
    component.nextDay();
    expect(component).toBeTruthy();
  })

});

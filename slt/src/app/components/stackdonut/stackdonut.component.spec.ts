import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StackDonutComponent } from './stackdonut.component';

describe('StackDonutComponent', () => {
  let component: StackDonutComponent;
  let fixture: ComponentFixture<StackDonutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StackDonutComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackDonutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create piechart', () => {
  //   expect(component).toBeTruthy();
  // });

});

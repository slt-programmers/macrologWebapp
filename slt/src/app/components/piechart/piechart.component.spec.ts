import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PiechartComponent } from './piechart.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PiechartComponent', () => {
  let component: PiechartComponent;
  let fixture: ComponentFixture<PiechartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PiechartComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create piechart', () => {
  //   expect(component).toBeTruthy();
  // });

});

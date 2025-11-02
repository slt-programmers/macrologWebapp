import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DateValidator } from './date.directive';

@Component({
  template: `
  <form>
    <input validDate>
  </form>`,
  imports: [FormsModule]
})
class TestComponent {
}

describe('Directive: valid date', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DateValidator, FormsModule, TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
  });

  it('should create', () => {
    const dateDirective = new DateValidator();
    expect(dateDirective).toBeTruthy();
  });

  it('should validate date', () => {
    const dateDirective = new DateValidator();
    let result = dateDirective.validate(new FormControl('1-1-2021'));
    expect(result).toBeNull();
    result = dateDirective.validate(new FormControl(''));
    expect(result).toBeNull();
    result = dateDirective.validate(new FormControl('32-4-2021'));
    expect(result).toEqual({ 'DateValidator': true });
  });

});

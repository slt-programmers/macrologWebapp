import { TestBed, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { DateValidator } from './date.directive';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


@Component({
  template: `
  <form>
    <input validDate>
  </form>`
})
class TestComponent {
}

describe('Directive: valid date', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [DateValidator, TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
  });

  // TODO Fix or move to protractor
  // it('should validate the date', async () => {
  //   inputEl.nativeElement.value = '26-03198';
  //   const inputEvent = new Event('input');
  //   inputEl.nativeElement.dispatchEvent(inputEvent);
  //   fixture.detectChanges();
  //   fixture.whenStable().then(() => {
  //     // dispatchEvent(inputEl.nativeElement, 'input');
  //     inputEl.nativeElement.dispatchEvent(inputEvent);
  //     expect(inputEl.nativeElement.style.borderColor).toEqual('red');
  //   });
  // });


});

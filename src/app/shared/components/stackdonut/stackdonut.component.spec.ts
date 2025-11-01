import { Renderer2, SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { StackDonutComponent } from './stackdonut.component';

describe('StackDonutComponent', () => {
  let component: StackDonutComponent;
  let fixture: ComponentFixture<StackDonutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [StackDonutComponent],
    providers: [
        MockProvider(Renderer2)
    ]
})
      .compileComponents();

    fixture = TestBed.createComponent(StackDonutComponent);
    component = fixture.componentInstance;
    component.goal = 100;
    component.achieved = 45;
    component.text = 'text'
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should detect changes', () => {
    component.ngOnChanges({achieved: {currentValue: 55} as SimpleChange });
    expect(component).toBeTruthy();

    component.ngOnChanges({goal: {currentValue: 10} as SimpleChange});
    expect(component).toBeTruthy();
  });
});

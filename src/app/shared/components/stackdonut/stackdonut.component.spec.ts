import { Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { StackDonutComponent } from './stackdonut.component';

describe('StackDonutComponent', () => {
  let component: StackDonutComponent;
  let fixture: ComponentFixture<StackDonutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackDonutComponent],
      providers: [
        MockProvider(Renderer2)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StackDonutComponent);
    fixture.componentRef.setInput('goal', 100);
    fixture.componentRef.setInput('achieved', 45);
    fixture.componentRef.setInput('text', 'text');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

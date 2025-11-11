import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PiechartComponent } from './piechart.component';

describe('PiechartComponent', () => {
  let component: PiechartComponent;
  let fixture: ComponentFixture<PiechartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiechartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PiechartComponent);
    fixture.componentRef.setInput('macros', { protein: 1, fat: 2, carbs: 3 })
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

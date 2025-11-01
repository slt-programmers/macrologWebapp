import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PiechartComponent } from './piechart.component';

describe('PiechartComponent', () => {
  let component: PiechartComponent;
  let fixture: ComponentFixture<PiechartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [PiechartComponent],
})
      .compileComponents();

    fixture = TestBed.createComponent(PiechartComponent);
    component = fixture.componentInstance;
    component.macros = {protein: 1, fat: 2, carbs: 3};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

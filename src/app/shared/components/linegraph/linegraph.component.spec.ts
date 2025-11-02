import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataPoint, GraphPoint, LinegraphComponent } from './linegraph.component';

describe('LinegraphComponent', () => {
  let component: LinegraphComponent;
  let fixture: ComponentFixture<LinegraphComponent>;
  let datapoints: DataPoint[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinegraphComponent]
    }).compileComponents();

    datapoints = [new DataPoint(1, 4), new DataPoint(2, 3), new DataPoint(3, 5), new DataPoint(4, 7)];
    fixture = TestBed.createComponent(LinegraphComponent);
    fixture.componentRef.setInput('dataset', datapoints);
    fixture.componentRef.setInput('yAxisStep', 0.5);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create linegraph', () => {
    expect(component).toBeTruthy();
  });

  it('should determine y axis points', () => {
    const result = component.determineYAxisPoints();
    expect(result).toEqual([7.5, 7, 6.5, 6, 5.5, 5, 4.5, 4, 3.5, 3]);
  });

  it('should determine x axis points', () => {
    const result = component.determineXAxisPoints();
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('should determine graph points', () => {
    component.yAxisHeight = 100;
    component.yAxisPoints = component.determineYAxisPoints();

    const result = component.convertDatasetToPoints();
    const graphPoints = [new GraphPoint(4, 22.22222222222222), new GraphPoint(3, 0), new GraphPoint(5, 44.44444444444444), new GraphPoint(7, 88.88888888888889)];
    expect(result).toEqual(graphPoints);
  });

});

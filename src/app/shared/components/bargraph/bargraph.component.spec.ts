import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataPoint } from '../linegraph/linegraph.component';
import { BargraphComponent } from './bargraph.component';

describe('BargraphComponent', () => {
  let component: BargraphComponent;
  let fixture: ComponentFixture<BargraphComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BargraphComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(BargraphComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('datasets', makeDataSets());
    fixture.componentRef.setInput('yAxisStep', 10);
    fixture.componentRef.setInput('xAxisStep', 1);
    fixture.detectChanges();
  });

  it('should create bargraph', () => {
    expect(component).toBeTruthy();
  });

  it('should setup graph points after view init', () => {
    fixture.detectChanges();
    expect(component.graphPoints).toBeDefined();
    expect(component.xAxisPoints).toBeDefined();
    expect(component.yAxisPoints).toBeDefined();
  });

  it('should determine y-axis points based on y-step', () => {
    fixture.componentRef.setInput('yAxisStep', 10);
    fixture.detectChanges();
    expect(component.yAxisPoints).toEqual([30, 20, 10]);

    fixture.componentRef.setInput('yAxisStep', 5);
    fixture.detectChanges();
    expect(component.yAxisPoints).toEqual([25, 20, 15, 10, 5]);

    fixture.componentRef.setInput('yAxisStep', 15);
    fixture.detectChanges();
    expect(component.yAxisPoints).toEqual([45, 30, 15]);

    fixture.componentRef.setInput('yAxisStep', 20);
    fixture.detectChanges();
    expect(component.yAxisPoints).toEqual([40, 20]);
  });

  it('should determine x-axis points', () => {
    fixture.detectChanges();
    expect(component.xAxisPoints).toEqual([1, 2, 3]);
  });

  it('should determine y-axis points with markers', () => {
    component.markers().push(15);
    fixture.detectChanges();
    expect(component.yAxisPoints).toEqual([30, 20, 10]);
  });

  function makeDataSets() {
    const datasetOne = [
      new DataPoint(1, 15),
      new DataPoint(2, 14),
      new DataPoint(3, 13),
    ];
    const datasetTwo = [
      new DataPoint(1, 10),
      new DataPoint(2, 12),
      new DataPoint(3, 14),
    ];
    return [datasetOne, datasetTwo];
  }
});

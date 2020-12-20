import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BargraphComponent } from './bargraph.component';
import { DataPoint } from '../linegraph/linegraph.component';
import { SimpleChange } from '@angular/core';

describe('BargraphComponent', () => {
  let component: BargraphComponent;
  let fixture: ComponentFixture<BargraphComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BargraphComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(BargraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create bargraph', () => {
    expect(component).toBeTruthy();
  });

  it('should setup graph points after view init', () => {
    component.datasets = makeDataSets();
    component.ngAfterViewInit();
    expect(component.graphPoints).toBeDefined();
    expect(component.xAxisPoints).toBeDefined();
    expect(component.yAxisPoints).toBeDefined();
  });

  it('should detect changes', () => {
    component.graphPoints = undefined;
    component.xAxisPoints = undefined;
    component.yAxisPoints = undefined;
    const simpleChange = new SimpleChange(undefined, makeDataSets, true);
    const simpleChanges = { datasets: simpleChange };
    component.ngOnChanges(simpleChanges);
    expect(component.xAxisPoints).not.toBeDefined();
    expect(component.yAxisPoints).not.toBeDefined();
    expect(component.graphPoints).not.toBeDefined();

    component.datasets = makeDataSets();
    fixture.detectChanges();
    component.ngOnChanges(simpleChanges);
    expect(component.xAxisPoints).toBeDefined();
    expect(component.yAxisPoints).toBeDefined();
    expect(component.graphPoints).toBeDefined();
  });

  it('should determine y-axis points based on y-step', () => {
    component.datasets = makeDataSets();
    component.yAxisStep = 10;
    const simpleChange = new SimpleChange(undefined, makeDataSets, true);
    const simpleChanges = { datasets: simpleChange };
    component.ngOnChanges(simpleChanges);
    expect(component.yAxisPoints).toEqual([30, 20, 10]);

    component.yAxisStep = 5;
    fixture.detectChanges();
    component.ngOnChanges(simpleChanges);
    expect(component.yAxisPoints).toEqual([25, 20, 15, 10, 5]);

    component.yAxisStep = 15;
    fixture.detectChanges();
    component.ngOnChanges(simpleChanges);
    expect(component.yAxisPoints).toEqual([45, 30, 15]);

    component.yAxisStep = 20;
    fixture.detectChanges();
    component.ngOnChanges(simpleChanges);
    expect(component.yAxisPoints).toEqual([40, 20]);
  });

  it('should determine x-axis points', () => {
    component.datasets = makeDataSets();
    const simpleChange = new SimpleChange(undefined, makeDataSets, true);
    const simpleChanges = { datasets: simpleChange };
    component.ngOnChanges(simpleChanges);
    expect(component.xAxisPoints).toEqual([1, 2, 3]);
  });

  it('should determine y-axis points with markers', () => {
    component.markers.push(15);
    component.yAxisStep = 10;
    component.datasets = makeDataSets();
    const simpleChange = new SimpleChange(undefined, makeDataSets, true);
    const simpleChanges = { datasets: simpleChange };

    component.ngOnChanges(simpleChanges);
    expect(component.yAxisPoints).toEqual([30, 20, 10]);

    component.markers = [];
    component.markers.push(35);
    component.ngOnChanges(simpleChanges);
    expect(component.yAxisPoints).toEqual([40, 30, 20, 10]);
  });

  it('should deal with undefined y values', () => {
    component.yAxisStep = 10;
    component.datasets = makeDataSets();
    component.datasets[0][0].y = undefined;
    const simpleChange = new SimpleChange(undefined, makeDataSets, true);
    const simpleChanges = { datasets: simpleChange };

    component.ngOnChanges(simpleChanges);
    expect(component.yAxisPoints).toEqual([30, 20, 10]);
  });

  function makeDataSets() {
    let datasets: DataPoint[][];
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
    datasets = [datasetOne, datasetTwo];
    return datasets;
  }
});

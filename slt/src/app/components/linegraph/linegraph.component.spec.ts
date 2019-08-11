import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinegraphComponent, DataPoint, GraphPoint } from './linegraph.component';
import { SimpleChange } from '@angular/core';

describe('LinegraphComponent', () => {
  let component: LinegraphComponent;
  let fixture: ComponentFixture<LinegraphComponent>;
  let datapoints: DataPoint[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LinegraphComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinegraphComponent);
    component = fixture.componentInstance;
    datapoints = [new DataPoint(1, 4), new DataPoint(2, 3), new DataPoint(3, 5), new DataPoint(4, 7)]
    fixture.detectChanges();
  });

  it('should create linegraph', () => {
    expect(component).toBeTruthy();
  });

  it('should call on changes on linegraph', () => {
    component.dataset = datapoints;
    const simpleChange = new SimpleChange('', '', false);
    const simpleChanges = { 'dataset': simpleChange };
    component.ngOnChanges(simpleChanges);
    expect(component.yAxisPoints.length).toBeGreaterThan(0);
    expect(component.xAxisPoints.length).toBeGreaterThan(0);
    expect(component.graphPoints.length).toBeGreaterThan(0);
  });

  it('should call after view init', () => {
    component.dataset = datapoints;
    const simpleChange = new SimpleChange('', '', false);
    const simpleChanges = { 'dataset': simpleChange };
    component.ngOnChanges(simpleChanges);
    fixture.detectChanges();
    component.ngAfterViewInit();
    fixture.detectChanges();
    expect(component.xAxisElement).toBeTruthy();
    expect(component.yAxisElement).toBeTruthy();
    expect(component.graphPoints).toBeTruthy();
  });

  it('should determine y axis points', () => {
    component.dataset = datapoints;
    component.yAxisStep = 0.5;
    const result = component.determineYAxisPoints();
    expect(result).toEqual([7.5, 7, 6.5, 6, 5.5, 5, 4.5, 4, 3.5, 3]);
  });

  it('should determine x axis points', () => {
    component.dataset = datapoints;
    const result = component.determineXAxisPoints();
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('should determine graph points', () => {
    component.dataset = datapoints;
    component.yAxisStep = 0.5;
    component.yAxisHeight = 100;
    component.yAxisPoints = component.determineYAxisPoints();

    const result = component.convertDatasetToPoints();
    const graphPoints = [new GraphPoint(4, 22.22222222222222), new GraphPoint(3, 0), new GraphPoint(5, 44.44444444444444), new GraphPoint(7, 88.88888888888889)];
    expect(result).toEqual(graphPoints);
  });

  it('should calculate graph', () => {
    component.dataset = datapoints;
    component.yAxisStep = 0.5;
    component.yAxisHeight = 100;
    const simpleChange = new SimpleChange('', '', false);
    const simpleChanges = { 'dataset': simpleChange };
    component.ngOnChanges(simpleChanges);
    fixture.detectChanges();
    component.ngAfterViewInit();
    fixture.detectChanges();
    component.svgPath = '';

    component.calculateGraph();
    expect(component.svgPath).toEqual('M92 108.88888888888889 L92 108.88888888888889 C112 108.88888888888889 256 140 276 140 C296 140 440 77.77777777777777 460 77.77777777777777 C480 77.77777777777777 624 15.555555555555557 644 15.555555555555557 L644 140 L92 140 Z');
  });

  it('should calculate trend', () => {
    component.dataset = datapoints;
    component.yAxisStep = 0.5;
    component.yAxisHeight = 100;
    const simpleChange = new SimpleChange('', '', false);
    const simpleChanges = { 'dataset': simpleChange };
    component.ngOnChanges(simpleChanges);
    fixture.detectChanges();
    component.ngAfterViewInit();
    fixture.detectChanges();
    component.trendPath = '';

    component.calculateTrend();
    expect(component.svgPath).toEqual( 'M92 77.77777777777777 L92 77.77777777777777 C112 77.77777777777777 256 100 276 100 C296 100 440 55.55555555555556 460 55.55555555555556 C480 55.55555555555556 624 11.111111111111114 644 11.111111111111114 L644 100 L92 100 Z');

  });

});

import { Component, Input, ViewChild, ElementRef, AfterViewInit, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'linegraph',
  templateUrl: './linegraph.component.html',
  styleUrls: ['./linegraph.component.scss']
})
export class LinegraphComponent implements AfterViewInit, OnChanges {

  @ViewChild('yAxis', { static: false }) public yAxisElement: ElementRef;

  @Input() dataset;
  @Input() yAxisStep;
  @Input() xAxisStep;

  public graphPoints: GraphPoint[];
  public yAxisPoints: number[];
  public xAxisPoints: number[];

  private yAxisHeight: number;

  constructor() {
  }

  ngAfterViewInit() {
    this.yAxisHeight = this.yAxisElement.nativeElement.clientHeight;
    if (this.dataset !== undefined) {
      this.graphPoints = this.convertDatasetToPoints();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataset'] && this.dataset !== undefined) {
      console.log(this.dataset);
      this.yAxisPoints = this.determineYAxisPoints();
      this.xAxisPoints = this.determineXAsixPoints();
      this.graphPoints = this.convertDatasetToPoints();
    }
  }

  private determineYAxisPoints() {
    const yAxisPoints = [];
    const yValues = []
    for (let i = 0; i < this.dataset.length; i++) {
      if (this.dataset[i].y !== undefined) {
        yValues.push(this.dataset[i].y);
      }
    }
    yValues.sort();

    const highest = yValues[yValues.length - 1];
    const lowest = yValues[0];
    const difference = highest - lowest;
    const leftover = lowest % this.yAxisStep;

    yAxisPoints.push(lowest - leftover);
    const yValuesToAdd = Math.round(difference / this.yAxisStep) + 1;
    for (let j = 0; j < yValuesToAdd; j++) {
      let value = yAxisPoints[j];
      value += this.yAxisStep;
      yAxisPoints.push(value);
    }
    yAxisPoints.reverse();
    return yAxisPoints;
  }

  private determineXAsixPoints() {
    const xAxisPoints = [];
    for (let i = 0; i < this.dataset.length; i++) {
      xAxisPoints.push(this.dataset[i].x)
    }
    return xAxisPoints;
  }

  private convertDatasetToPoints() {
    const graphPoints = [];
    console.log(this.yAxisHeight);
    for (const dataPoint of this.dataset) {
      const lowestYValue = this.yAxisPoints[this.yAxisPoints.length - 1];
      const differenceHighestLowestYValue = this.yAxisPoints[0] - lowestYValue;
      let height = 0;
      if (dataPoint.y !== undefined) {
        height = (dataPoint.y - lowestYValue) * (this.yAxisHeight / differenceHighestLowestYValue);
      }
      const graphPoint = new GraphPoint(dataPoint.y, height);
      graphPoints.push(graphPoint);
    }
    console.log(graphPoints);
    return graphPoints;
  }
}

export class DataPoint {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class GraphPoint {
  public value: number;
  public height: number;

  constructor(value: number, height: number) {
    this.value = value;
    this.height = height;
  }
}
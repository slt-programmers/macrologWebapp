import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { DataPoint, GraphPoint } from '../linegraph/linegraph.component';

@Component({
  selector: 'bargraph',
  templateUrl: './bargraph.component.html',
  styleUrls: ['./bargraph.component.scss']
})
export class BargraphComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild('yAxis', { static: false }) public yAxisElement: ElementRef;
  @ViewChild('xAxis', { static: false }) public xAxisElement: ElementRef;

  @Input() dataset: DataPoint[];
  @Input() yAxisStep: number;
  @Input() xAxisStep: number;
  @Input() markers: number[];
  @Input() color: string;
  @Input() colorFill: string;

  public graphPoints: GraphPoint[];
  public yAxisPoints: number[];
  public xAxisPoints: number[];

  yAxisHeight: number;
  markerHeights: number[];
  private xAxisWidth: number;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.yAxisHeight = this.yAxisElement.nativeElement.clientHeight;
    this.xAxisWidth = this.xAxisElement.nativeElement.clientWidth;
    if (this.dataset !== undefined) {
      this.graphPoints = this.convertDatasetToPoints();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataset'] && this.dataset !== undefined) {
      this.yAxisPoints = this.determineYAxisPoints();
      this.xAxisPoints = this.determineXAxisPoints();
      this.graphPoints = this.convertDatasetToPoints();
    }
  }

  determineYAxisPoints() {
    const yAxisPoints = [];
    const yValues = [];
    for (let i = 0; i < this.dataset.length; i++) {
      if (this.dataset[i].y !== undefined) {
        yValues.push(this.dataset[i].y);
      }
    }
    yValues.sort();

    let highest = yValues[yValues.length - 1];
    for (let marker of this.markers) {
      if (marker > highest) {
        highest = marker;
      }
    }
    const lowest = 0;
    const difference = highest - lowest;

    yAxisPoints.push(lowest);
    const yValuesToAdd = Math.round(difference / this.yAxisStep) + 1;
    for (let j = 0; j < yValuesToAdd; j++) {
      let value = yAxisPoints[j];
      value += this.yAxisStep;
      yAxisPoints.push(value);
    }
    yAxisPoints.reverse();
    return yAxisPoints;
  }

  determineXAxisPoints() {
    const xAxisPoints = [];
    for (let i = 0; i < this.dataset.length; i++) {
      xAxisPoints.push(this.dataset[i].x);
    }
    return xAxisPoints;
  }

  convertDatasetToPoints() {
    const graphPoints = [];
    const differenceHighestLowestYValue = this.yAxisPoints[0];
    for (const dataPoint of this.dataset) {
      let height = undefined;
      if (dataPoint.y !== undefined) {
        height = (dataPoint.y) * (this.yAxisHeight / differenceHighestLowestYValue);
      }
      const graphPoint = new GraphPoint(dataPoint.y, height);
      graphPoints.push(graphPoint);
    }
    this.markerHeights = [];
    for (let marker of this.markers) {
      this.markerHeights.push(marker * (this.yAxisHeight / differenceHighestLowestYValue));
    }
    return graphPoints;
  }
}

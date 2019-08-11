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

  @Input() datasets: DataPoint[][];
  @Input() yAxisStep: number;
  @Input() xAxisStep: number;
  @Input() markers: number[] = [];
  @Input() colors: string[] = [];
  @Input() fillColors: string[] = [];

  public graphPoints: GraphPoint[][];
  public yAxisPoints: number[];
  public xAxisPoints: number[];

  yAxisHeight: number;
  markerHeights: number[];
  private xAxisWidth: number;

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.yAxisHeight = this.yAxisElement.nativeElement.clientHeight;
    this.xAxisWidth = this.xAxisElement.nativeElement.clientWidth;
    if (this.datasets !== undefined) {
      this.graphPoints = this.convertDatasetToPoints();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['datasets'] && this.datasets !== undefined) {
      this.yAxisPoints = this.determineYAxisPoints();
      this.xAxisPoints = this.determineXAxisPoints();
      this.graphPoints = this.convertDatasetToPoints();
    }
  }

  determineYAxisPoints() {
    const yAxisPoints = [];
    const yValues = [];
    for (let i = 0; i < this.datasets[0].length; i++) {
      let yValue = 0;
      for (let j = 0; j < this.datasets.length; j++) {
        if (this.datasets[j][i].y) {
          yValue += this.datasets[j][i].y;
        }
      }
      yValues.push(yValue);
    }

    yValues.sort((a, b) => { return a - b; });
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
    for (let i = 0; i < this.datasets[0].length; i++) {
      xAxisPoints.push(this.datasets[0][i].x);
    }
    return xAxisPoints;
  }

  convertDatasetToPoints(): GraphPoint[][] {
    const graphPoints = [];
    const differenceHighestLowestYValue = this.yAxisPoints[0];
    for (let i = 0; i < this.datasets.length; i++) {
      const graphPointSet = []
      for (let dataPoint of this.datasets[i]) {
        let height = undefined;
        if (dataPoint.y !== undefined) {
          height = (dataPoint.y) * (this.yAxisHeight / differenceHighestLowestYValue);
        }
        const graphPoint = new GraphPoint(dataPoint.y, height);
        graphPointSet.push(graphPoint);
      }
      graphPoints.push(graphPointSet);
    }
    this.markerHeights = [];

    for (let i = 0; i < this.markers.length; i++) {
      let markerValue = 0;
      for (let j = 0; j <= i; j++) {
        markerValue += this.markers[j];
      }
      this.markerHeights.push(markerValue * (this.yAxisHeight / differenceHighestLowestYValue));
    }

    return graphPoints;
  }
}

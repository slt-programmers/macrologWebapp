import { Component, Input, ViewChild, ElementRef, AfterViewInit, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'linegraph',
  templateUrl: './linegraph.component.html',
  styleUrls: ['./linegraph.component.scss']
})
export class LinegraphComponent implements AfterViewInit, OnChanges {

  @ViewChild('yAxis', { static: false }) public yAxisElement: ElementRef;
  @ViewChild('xAxis', { static: false }) public xAxisElement: ElementRef;

  @Input() dataset;
  @Input() yAxisStep: number;
  @Input() xAxisStep: number;
  @Input() hasOffgridValue: DataPoint;

  public graphPoints: GraphPoint[];
  public yAxisPoints: number[];
  public xAxisPoints: number[];
  public svgPath: string;
  public yAxisHeight: number;
  
  private xAxisWidth: number;
  private xAxisPointWidth: number;

  constructor() {
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
      this.xAxisPoints = this.determineXAsixPoints();
      this.graphPoints = this.convertDatasetToPoints();

      this.xAxisPointWidth = this.xAxisWidth / this.dataset.length;
      let yStartPosition = this.determineYStartPosition();
      let xStartPosition = this.determineXStartPosition();
      
      this.svgPath = "M" + xStartPosition + " " + yStartPosition;

      let xPosition = 0;
      let xStartOffset = this.xAxisPointWidth / 2; // first data point

      for (let i = 0; i < this.graphPoints.length; i++) {
        const graphPoint = this.graphPoints[i];
        if (graphPoint.height !== 0) {
          if (xPosition == 0) {
            xPosition = (this.xAxisPointWidth * i) + xStartOffset;
            this.svgPath += " L" + xPosition + " " + (this.yAxisHeight - graphPoint.height);
          } else {
            xPosition = (this.xAxisPointWidth * i) + xStartOffset;
            let previousXPosition = (this.xAxisPointWidth * i) + xStartOffset - this.xAxisPointWidth;
            let x1 = previousXPosition + 20;

            let previousYPosition: number;
            let j = i - 1;
            while(true) {
              if (this.graphPoints[j].height !== 0) {
                previousYPosition = this.yAxisHeight - this.graphPoints[j].height;
                break;
              }
              j--;
            }
            
            let y1 = previousYPosition;

            let x2 = xPosition - 20;
            let y2 = this.yAxisHeight - graphPoint.height;
            this.svgPath += " C" + x1 + " " + y1 + " " + x2 + " " + y2 + " " + xPosition + " " + (this.yAxisHeight - graphPoint.height);
          }
        }
      }
      this.svgPath += " L" + xPosition + " " + this.yAxisHeight +
        " L" + xStartPosition + " " + this.yAxisHeight + "  Z";
    }
  }

  private determineXStartPosition(): number {
    if (this.hasOffgridValue) {
      return 0;
    }
    for (let i = 0; i < this.graphPoints.length; i++) {
      const dataPoint = this.graphPoints[i];
      if (dataPoint.height !== 0) {
        return (this.xAxisPointWidth * i) + this.xAxisPointWidth / 2;

      }
    }
    return 0;
  }

  private determineYStartPosition(): number {
    for (let j = 0; j < this.graphPoints.length; j++) {
      const dataPoint = this.graphPoints[j];
      if (dataPoint.height !== 0) {
        return this.yAxisHeight - dataPoint.height;
      }
    }
    return 0;
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
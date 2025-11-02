import { NgClass } from '@angular/common';
import {
  afterRenderEffect,
  Component,
  effect,
  ElementRef,
  input,
  viewChild
} from '@angular/core';
import { DataPoint, GraphPoint } from '../linegraph/linegraph.component';

@Component({
  selector: 'ml-bargraph',
  templateUrl: './bargraph.component.html',
  styleUrls: ['./bargraph.component.scss'],
  imports: [NgClass]
})
export class BargraphComponent {
  public readonly yAxisElement = viewChild<ElementRef>('yAxis');
  public readonly xAxisElement = viewChild<ElementRef>('xAxis');

  readonly datasets = input.required<DataPoint[][]>();
  readonly yAxisStep = input.required<number>();
  readonly xAxisStep = input.required<number>();
  readonly markers = input<number[]>([]);
  readonly colors = input<string[]>([]);
  readonly fillColors = input<string[]>([]);

  public graphPoints: GraphPoint[][];
  public yAxisPoints: number[];
  public xAxisPoints: number[];

  yAxisHeight: number;
  xAxisWidth: number;
  xAxisHeight: number;
  markerHeights: number[];

  constructor() {
    effect(() => {
      this.yAxisPoints = this.determineYAxisPoints();
      this.xAxisPoints = this.determineXAxisPoints();
      this.graphPoints = this.convertDatasetToPoints();
    });
    afterRenderEffect(() => {
      this.yAxisHeight = this.yAxisElement().nativeElement.clientHeight;
      this.xAxisWidth = this.xAxisElement().nativeElement.clientWidth;
      this.xAxisHeight = this.xAxisElement().nativeElement.clientHeight;
      if (this.datasets()) {
        this.yAxisPoints = this.determineYAxisPoints();
        this.xAxisPoints = this.determineXAxisPoints();
        this.graphPoints = this.convertDatasetToPoints();
      }
    })
  }

  private determineYAxisPoints(): number[] {
    const yAxisPoints: number[] = [];
    const yValues = [];
    for (let i = 0; i < this.datasets()[0].length; i++) {
      let yValue = 0;
      for (let j = 0; j < this.datasets().length; j++) {
        const datasets = this.datasets();
        if (datasets[j][i].y) {
          yValue += datasets[j][i].y;
        }
      }
      yValues.push(yValue);
    }

    yValues.sort((a, b) => a - b);
    const highest = this.determineHighestYValue(yValues);

    const lowest = 0;
    const difference = highest - lowest;

    yAxisPoints.push(lowest);
    let yValuesToAdd = Math.round(difference / this.yAxisStep());
    if (yValuesToAdd === 1 || yValuesToAdd === 2) {
      yValuesToAdd += 1;
    }

    for (let j = 0; j < yValuesToAdd; j++) {
      let value = yAxisPoints[j];
      value += this.yAxisStep();
      yAxisPoints.push(value);
    }
    yAxisPoints.reverse();
    yAxisPoints.pop();
    return yAxisPoints;
  }

  private determineHighestYValue(yValues: number[]): number {
    let highest = yValues[yValues.length - 1];
    let markersTotal = 0;
    for (const marker of this.markers()) {
      markersTotal += marker;
    }
    if (markersTotal > highest) {
      highest = markersTotal;
    }
    return highest;
  }

  private determineXAxisPoints(): number[] {
    const xAxisPoints = [];
    for (let i = 0; i < this.datasets()[0].length; i++) {
      xAxisPoints.push(this.datasets()[0][i].x);
    }
    return xAxisPoints;
  }

  private convertDatasetToPoints(): GraphPoint[][] {
    const graphPoints = [];
    const differenceHighestLowestYValue = this.yAxisPoints[0];
    for (let i = 0; i < this.datasets().length; i++) {
      const graphPointSet = [];
      for (const dataPoint of this.datasets()[i]) {
        let height: number;
        if (dataPoint.y !== undefined) {
          height =
            dataPoint.y * (this.yAxisHeight / differenceHighestLowestYValue);
        }
        const graphPoint = new GraphPoint(dataPoint.y, height);
        graphPointSet.push(graphPoint);
      }
      graphPoints.push(graphPointSet);
    }
    this.calculateMarkerHeights(differenceHighestLowestYValue);
    return graphPoints;
  }

  private calculateMarkerHeights(differenceHighestLowestYValue: number): void {
    this.markerHeights = [];
    for (let i = 0; i < this.markers().length; i++) {
      let markerValue = 0;
      for (let j = 0; j <= i; j++) {
        markerValue += this.markers()[j];
      }
      this.markerHeights.push(
        markerValue * (this.yAxisHeight / differenceHighestLowestYValue) +
        2 * i +
        1
      ); // border correction
    }
  }
}

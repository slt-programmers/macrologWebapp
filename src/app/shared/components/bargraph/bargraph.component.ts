import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import { DataPoint, GraphPoint } from '../linegraph/linegraph.component';
import { NgFor, NgIf, NgClass } from '@angular/common';

@Component({
    selector: 'ml-bargraph',
    templateUrl: './bargraph.component.html',
    styleUrls: ['./bargraph.component.scss'],
    imports: [NgFor, NgIf, NgClass]
})
export class BargraphComponent implements OnChanges, AfterViewInit {
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
  xAxisWidth: number;
  xAxisHeight: number;
  markerHeights: number[];

  ngAfterViewInit() {
    this.yAxisHeight = this.yAxisElement.nativeElement.clientHeight;
    this.xAxisWidth = this.xAxisElement.nativeElement.clientWidth;
    this.xAxisHeight = this.xAxisElement.nativeElement.clientHeight;
    if (this.datasets !== undefined) {
      this.yAxisPoints = this.determineYAxisPoints();
      this.xAxisPoints = this.determineXAxisPoints();
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

  private determineYAxisPoints(): number[] {
    const yAxisPoints: number[] = [];
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

    yValues.sort((a, b) => a - b);
    const highest = this.determineHighestYValue(yValues);

    const lowest = 0;
    const difference = highest - lowest;

    yAxisPoints.push(lowest);
    let yValuesToAdd = Math.round(difference / this.yAxisStep);
    if (yValuesToAdd === 1 || yValuesToAdd === 2) {
      yValuesToAdd += 1;
    }

    for (let j = 0; j < yValuesToAdd; j++) {
      let value = yAxisPoints[j];
      value += this.yAxisStep;
      yAxisPoints.push(value);
    }
    yAxisPoints.reverse();
    yAxisPoints.pop();
    return yAxisPoints;
  }

  private determineHighestYValue(yValues: number[]): number {
    let highest = yValues[yValues.length - 1];
    let markersTotal = 0;
    for (const marker of this.markers) {
      markersTotal += marker;
    }
    if (markersTotal > highest) {
      highest = markersTotal;
    }
    return highest;
  }

  private determineXAxisPoints(): number[] {
    const xAxisPoints = [];
    for (let i = 0; i < this.datasets[0].length; i++) {
      xAxisPoints.push(this.datasets[0][i].x);
    }
    return xAxisPoints;
  }

  private convertDatasetToPoints(): GraphPoint[][] {
    const graphPoints = [];
    const differenceHighestLowestYValue = this.yAxisPoints[0];
    for (let i = 0; i < this.datasets.length; i++) {
      const graphPointSet = [];
      for (const dataPoint of this.datasets[i]) {
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
    for (let i = 0; i < this.markers.length; i++) {
      let markerValue = 0;
      for (let j = 0; j <= i; j++) {
        markerValue += this.markers[j];
      }
      this.markerHeights.push(
        markerValue * (this.yAxisHeight / differenceHighestLowestYValue) +
          2 * i +
          1
      ); // border correction
    }
  }
}

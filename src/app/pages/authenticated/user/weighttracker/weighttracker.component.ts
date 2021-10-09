import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { WeightService } from '../../../../shared/services/weight.service';
import { Weight } from '../../../../model/weight';
import { ToastService } from '../../../../shared/services/toast.service';
import { DataPoint } from 'src/app/shared/components/linegraph/linegraph.component';
import { NgForm } from '@angular/forms';
import { format, isAfter, isBefore, parse } from 'date-fns';

@Component({
  selector: 'weighttracker',
  templateUrl: './weighttracker.component.html',
  styleUrls: ['./weighttracker.component.scss'],
})
export class WeightTrackerComponent {
  public trackedWeights = new Array<Weight>();
  public measurementDate?: string;
  public weight?: number;
  public remark?: string;
  public openWeight?: Weight;

  public dataset?: DataPoint[];
  public hasOffgridValue?: boolean;

  private pipe: DatePipe;

  constructor(
    private weightService: WeightService,
    private toastService: ToastService
  ) {
    this.getAllWeights();
    this.pipe = new DatePipe('en-US');
    this.init();
  }

  private getAllWeights() {
    this.weightService.getAllWeights().subscribe(
      (data) => {
        this.trackedWeights = data;
        this.trackedWeights.sort((a, b) => {
          if (a.day && b.day) {
            const date1 = parse(a.day, 'yyyy-MM-dd', new Date());
            const date2 = parse(b.day, 'yyyy-MM-dd', new Date());
            return this.compare(date1, date2);
          }
          return 0;
        });
        this.getWeightDataset();
      },
      (error) => {
        // TODO handle error
      }
    );
  }

  public init() {
    this.measurementDate = format(new Date(), 'dd-MM-yyyy');
  }

  private compare(dateA: Date, dateB: Date) {
    if (isBefore(dateA, dateB)) {
      return 1;
    } else if (isAfter(dateA, dateB)) {
      return -1;
    } else {
      return 0;
    }
  }

  private getWeightDataset() {
    const dataset = [];
    let numberOfValues = 14;
    if (window.innerWidth > 480) {
      numberOfValues = 21;
    }
    if (window.innerWidth > 768) {
      numberOfValues = 30;
    }
    for (let i = 0; i < numberOfValues; i++) {
      const day = new Date();
      day.setDate(day.getDate() - i);

      const daynumber = day.getDate();
      const weightValue = this.getWeightValueForDay(day, numberOfValues);
      if (weightValue !== undefined) {
        const datapoint = new DataPoint(daynumber, weightValue);
        dataset.push(datapoint);
      }
    }
    this.dataset = dataset;
    this.dataset.reverse();
    const dayBeforeGraph = new Date();
    dayBeforeGraph.setDate(dayBeforeGraph.getDate() - (numberOfValues - 1));
    this.hasOffgridValue = this.hasOffgridWeight(dayBeforeGraph);
  }

  private getWeightValueForDay(date: Date, numberOfValues: number) {
    for (let i = 0; i < numberOfValues; i++) {
      const weight = this.trackedWeights[i];
      if (weight && weight.day === this.pipe.transform(date, 'yyyy-MM-dd')) {
        return weight.weight;
      }
    }
    return undefined;
  }

  private hasOffgridWeight(day: Date): boolean {
    const firstMeasureDay = new Date(
      this.trackedWeights[this.trackedWeights.length - 1].day || ''
    );
    if (firstMeasureDay > day) {
      return false;
    }
    return true;
  }

  public saveNewWeight(formUsed: NgForm): void {
    const newRequest: Weight = {};
    newRequest.weight = this.weight;
    const date = parse(this.measurementDate || '', 'dd-MM-yyyy', new Date());
    newRequest.day = this.pipe.transform(date, 'yyyy-MM-dd') || undefined;
    newRequest.remark = this.remark;

    const closeCallBack = () => {
      formUsed.reset();
      this.getAllWeights();
      this.init();
    };

    this.weightService.storeWeight(newRequest, closeCallBack);
  }

  public editWeight(weight: Weight) {
    if (this.openWeight) {
      if (this.openWeight.id === weight.id) {
        weight.editable = true;
      } else {
        this.openWeight.editable = false;
        this.initOpenWeight(weight);
      }
    } else {
      this.initOpenWeight(weight);
    }
  }

  private initOpenWeight(weight: Weight) {
    this.openWeight = weight;
    const date = parse(this.openWeight.day || '', 'yyyy-MM-dd', new Date());
    this.openWeight.day = this.pipe.transform(date, 'dd-MM-yyyy') || undefined;
    weight.editable = true;
  }

  private closeCallBack(action: string) {
    this.getAllWeights();
    this.openWeight = undefined;
    this.toastService.setMessage('Your weight measurement has been ' + action);
  }

  public deleteWeight(weight: Weight) {
    this.weightService.deleteWeight(weight, () =>
      this.closeCallBack('deleted!')
    );
  }

  public saveWeight(weight: Weight) {
    const date = parse(weight.day || '', 'dd-MM-yyyy', new Date());

    const newRequest: Weight = {};
    newRequest.id = weight.id;
    newRequest.weight = weight.weight;
    newRequest.day = this.pipe.transform(date, 'yyyy-MM-dd') || undefined;
    newRequest.remark = weight.remark;

    this.weightService.storeWeight(newRequest, () =>
      this.closeCallBack('updated!')
    );
  }
}

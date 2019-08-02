import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { WeightService } from '../../../services/weight.service';
import { Weight } from '../../../model/weight';
import { ToastService } from '../../../services/toast.service';
import * as moment from 'moment';
import { DataPoint } from '@app/components/linegraph/linegraph.component';

@Component({
  selector: 'user-weighttracker',
  templateUrl: './user.weighttracker.component.html',
  host: { '(document: click)': 'documentClick($event)' }
})
export class UserWeightTrackerComponent {

  public trackedWeights = new Array<Weight>();
  public measurementDate: string;
  public weight;
  public remark: string;
  public openWeight;

  // test
  public dataset;

  private pipe: DatePipe;

  constructor(private weightService: WeightService,
    private toastService: ToastService) {
    this.getAllWeights();
    this.pipe = new DatePipe('en-US');
    this.init();
  }

  private getAllWeights() {
    this.weightService.getAllWeights().subscribe(
      data => {
        this.trackedWeights = data;
        this.trackedWeights.sort((a, b) => {
          const date1 = moment(a.day, 'YYYY-M-D', true);
          const date2 = moment(b.day, 'YYYY-M-D', true);
          return this.compare(date1, date2);
        });
        this.getWeightDataset();
      },
      error => console.log(error)
    );
  }

  public init() {
    this.measurementDate = moment().format('DD-MM-YYYY');
  }

  private compare(momentA, momentB) {
    if (momentA.isBefore(momentB)) {
      return 1;
    } else if (momentA.isAfter(momentB)) {
      return -1;
    } else {
      return 0;
    }
  }

  private getWeightDataset() {
    let dataSetLength = this.trackedWeights.length;
    if (dataSetLength > 20) {
      dataSetLength = 20;
    }
    const dataset = [];
    for (let i = 0; i < dataSetLength; i++) {
      const day = new Date();
      day.setDate(day.getDate() - i);

      const daynumber = day.getDate();
      const weightValue = this.getWeightValueForDay(day);
      const datapoint = new DataPoint(daynumber, weightValue);
      dataset.push(datapoint);
    }
    this.dataset = dataset;
    this.dataset.reverse();
  }

  private getWeightValueForDay(date: Date) {
    for (let i = 0; i < 20; i++) {
      const weight = this.trackedWeights[i];
      if (weight.day === this.pipe.transform(date, 'yyyy-MM-dd')) {
        return weight.weight;
      }
    }
    return undefined;
  }

  public saveNewWeight(formUsed): void {
    const newRequest = new Weight();
    newRequest.weight = this.weight;
    const date = moment(this.measurementDate, 'D-M-YYYY', true);
    newRequest.day = this.pipe.transform(date, 'yyyy-MM-dd');
    newRequest.remark = this.remark;

    const closeCallBack = () => {
      formUsed.reset();
      this.getAllWeights();
      this.init();
    };

    this.weightService.storeWeight(newRequest, closeCallBack);
  }
  public editWeight(w) {
    if (this.openWeight) {
      if (this.openWeight.id === w.id) {
        w.editable = true;
      } else {
        this.openWeight.editable = false;
        this.initOpenWeight(w);
      }
    } else {
      this.initOpenWeight(w);
    }
  }

  private initOpenWeight(w) {
    this.openWeight = w;
    const date = moment(this.openWeight.day, 'YYYY-M-D', true);
    this.openWeight.dayString = this.pipe.transform(date, 'dd-MM-yyyy');
    this.openWeight.weightString = this.openWeight.weight;
    w.editable = true;
  }

  private closeCallBack(action: string) {
    this.getAllWeights();
    this.openWeight = null;
    this.toastService.setMessage('Your weight measurement has been ' + action);
  }

  public deleteWeight(w) {
    this.weightService.deleteWeight(w, () => this.closeCallBack('deleted!'));
  }

  public saveWeight(w) {
    const date = moment(w.dayString, 'D-M-YYYY', true);
    w.day = this.pipe.transform(date, 'yyyy-MM-dd');
    w.weight = w.weightString;
    this.weightService.storeWeight(w, () => this.closeCallBack('updated!'));
  }

  private documentClick(event) {
    if (!event.target.classList.contains('weight__day') &&
      !event.target.classList.contains('weight__weight') &&
      !event.target.classList.contains('weight__remark') &&
      !event.target.classList.contains('editweight__day-input') &&
      !event.target.classList.contains('editweight__weight-input') &&
      !event.target.classList.contains('editweight__remark-input') &&
      !event.target.classList.contains('editweight__day') &&
      !event.target.classList.contains('editweight__weight') &&
      !event.target.classList.contains('editweight__remark') &&
      !event.target.classList.contains('editweight')
    ) {
      if (this.openWeight) {
        this.openWeight.editable = false;
      }
    }
  }
}

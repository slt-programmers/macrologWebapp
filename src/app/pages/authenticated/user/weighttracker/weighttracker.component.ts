import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { WeightService } from '../../../../shared/services/weight.service';
import { Weight } from '../../../../shared/model/weight';
import { DataPoint } from 'src/app/shared/components/linegraph/linegraph.component';
import { NgForm, FormsModule } from '@angular/forms';
import { format, isAfter, isBefore, parse } from 'date-fns';
import { LinegraphComponent } from '../../../../shared/components/linegraph/linegraph.component';

@Component({
  selector: 'ml-weighttracker',
  templateUrl: './weighttracker.component.html',
  imports: [LinegraphComponent, FormsModule, DecimalPipe, DatePipe]
})
export class WeightTrackerComponent implements OnInit {
  private readonly weightService = inject(WeightService);

  public trackedWeights: Weight[] = [];
  public measurementDate?: string;
  public weight?: number;
  public remark?: string;
  public openWeight?: Weight;

  public dataset?: DataPoint[];
  public hasOffgridValue?: boolean;

  private pipe = new DatePipe('en-US');

  ngOnInit() {
    this.getAllWeights();
    this.init();
  }

  private getAllWeights() {
    this.weightService.getAllWeights().subscribe(it => {
      this.trackedWeights = it;
      this.trackedWeights.sort((a, b) => {
        if (a.day && b.day) {
          const date1 = parse(a.day, 'yyyy-MM-dd', new Date());
          const date2 = parse(b.day, 'yyyy-MM-dd', new Date());
          return this.compare(date1, date2);
        }
        return 0;
      });
      this.getWeightDataset();
    });
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
    const newWeight: Weight = {};
    newWeight.weight = this.weight;
    const date = parse(this.measurementDate || '', 'dd-MM-yyyy', new Date());
    newWeight.day = this.pipe.transform(date, 'yyyy-MM-dd') || undefined;
    newWeight.remark = this.remark;

    this.weightService.addWeight(newWeight).subscribe(() => {
      formUsed.reset();
      this.getAllWeights();
      this.init();
    });
  }

  public editWeight(weight: Weight) {
    if (this.openWeight) {
      if (this.openWeight.id === weight.id) {
        weight.editMode = true;
      } else {
        this.openWeight.editMode = false;
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
    weight.editMode = true;
  }

  public deleteWeight(weight: Weight) {
    this.weightService.deleteWeight(weight).subscribe(() => {
      this.getAllWeights();
      this.openWeight = undefined;
    });
  }

  public saveWeight(weight: Weight) {
    const date = parse(weight.day || '', 'dd-MM-yyyy', new Date());

    const newRequest: Weight = {};
    newRequest.id = weight.id;
    newRequest.weight = weight.weight;
    newRequest.day = this.pipe.transform(date, 'yyyy-MM-dd') || undefined;
    newRequest.remark = weight.remark;

    this.weightService.addWeight(newRequest).subscribe(() => {
      this.getAllWeights();
      this.openWeight = undefined;
    });
  }
}

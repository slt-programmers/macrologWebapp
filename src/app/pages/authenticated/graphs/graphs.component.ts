import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DiaryService } from '../../../shared/services/diary.service';
import { UserService } from '../../../shared/services/user.service';
import { DataPoint } from 'src/app/shared/components/linegraph/linegraph.component';
import { MacrosPerDay } from 'src/app/shared/model/macrosPerDay';
import { Macros } from 'src/app/shared/model/macros';
import { format } from 'date-fns';

@Component({
  selector: 'ml-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss'],
})
export class GraphsComponent implements OnInit {

  public measurement = 'calories';
  public measurementOption = 'total';

  public splitted = false;
  public percentages = false;
  public loading = true;
  public dateTo: Date;
  public dateFrom: Date;

  private userGoals: any[];
  private goalCalories = 0;
  private allMacros: MacrosPerDay[] = [];

  public yAxisStep = 20;

  public graphLabel = 'Total calories per day grouped by macronutrient';
  public ratioGraphLabel = 'Ratio calories per day grouped by macronutrient';
  public proteinGraphLabel = 'Total calories from protein per day';
  public fatGraphLabel = 'Total calories from fat per day';
  public carbsGraphLabel = 'Total calories from carbs per day';

  public proteinDataset: DataPoint[];
  public fatDataset: DataPoint[];
  public carbsDataset: DataPoint[];

  public proteinRatioDataset: DataPoint[];
  public fatRatioDataset: DataPoint[];
  public carbsRatioDataset: DataPoint[];

  public proteinMarker: number;
  public fatMarker: number;
  public carbsMarker: number;
  public markers: any[] = [];
  public ratioMarkers: any[] = [];

  private numberOfValues = 30;
  // Types of graphs:
  // Grams
  //    Total grams per day grouped by macros -- done
  //    Splitted total grams per day per macro -- done
  //    Percentage/ratio gramps per marco per day
  // Energy (calories)
  //    Total calories per day grouped by macros -- done
  //    Splitted total calories per day per macro -- done
  //    Percentage/ratio calories per macro per day (streched bars)

  constructor(private logService: DiaryService, 
    private userService: UserService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.dateTo = new Date();
    this.dateFrom = new Date();
    this.dateFrom.setMonth(this.dateFrom.getMonth() - 1);
    this.dateFrom.setDate(this.dateFrom.getDate() + 1);
    this.getLogData();
  }

  public switchMeasurement() {
    if (this.measurement === 'grams') {
      this.getDatasetsForType('grams');
      this.graphLabel = 'Total grams per day grouped by macronutrient';
      this.ratioGraphLabel = 'Ratio grams per day grouped by macronutrient';
      this.proteinGraphLabel = 'Total grams of protein per day';
      this.fatGraphLabel = 'Total grams of fat per day';
      this.carbsGraphLabel = 'Total grams of carbs per day';
      this.markers = [this.proteinMarker, this.fatMarker, this.carbsMarker];
    } else {
      this.getDatasetsForType('calories');
      this.graphLabel = 'Total calories per day grouped by macronutrient';
      this.ratioGraphLabel = 'Ratio calories per day grouped by macronutrient';
      this.proteinGraphLabel = 'Total calories from protein per day';
      this.fatGraphLabel = 'Total calories from fat per day';
      this.carbsGraphLabel = 'Total calories from carbs per day';
      this.markers = [this.goalCalories];
    }
  }

  public switchOption() {
    this.ref.detectChanges();
  }

  public monthBack() {
    this.dateTo = new Date(this.dateFrom);
    this.dateTo.setDate(this.dateFrom.getDate() - 1);
    this.dateFrom = new Date(this.dateTo);
    this.dateFrom.setMonth(this.dateFrom.getMonth() - 1);
    this.dateFrom.setDate(this.dateFrom.getDate() + 1);
    this.getLogData();
  }

  public monthForward() {
    this.dateFrom = new Date(this.dateTo);
    this.dateFrom.setDate(this.dateFrom.getDate() + 1);
    this.dateTo = new Date(this.dateFrom);
    this.dateTo.setMonth(this.dateTo.getMonth() + 1);
    this.dateTo.setDate(this.dateTo.getDate() - 1);
    this.getLogData();
  }

  private getLogData() {
    this.loading = true;
    this.allMacros = [];
    this.logService
      .getMacrosPerDay(format(this.dateFrom, 'yyyy-MM-dd'), format(this.dateTo, 'yyyy-MM-dd')).subscribe(
        (data) => {
          this.allMacros = data;
          this.getGoals();
        },
        () => {
          this.allMacros = [];
        }
      );
  }

  private getGoals() {
    this.userService
      .getUserGoalStats(format(this.dateFrom, 'yyyy-MM-dd'))
      .subscribe(
        (data) => {
          if (data[0] === null) {
            this.userGoals = null;
          } else {
            this.userGoals = data;
          }
          this.setGoalCalories();
          this.numberOfValues =
            (this.dateTo.getTime() - this.dateFrom.getTime()) /
            1000 /
            60 /
            60 /
            24 +
            1;
          this.getDatasets();
          this.loading = false;
        }
      );
  }

  private getDatasets() {
    if (this.measurement === 'calories') {
      this.getDatasetsForType('calories');
    } else {
      this.getDatasetsForType('grams');
    }
  }

  private getDatasetsForType(type: string) {
    const carbsDataset = [];
    const fatDataset = [];
    const proteinDataset = [];
    const proteinRatioDataset = [];
    const fatRatioDataset = [];
    const carbsRatioDataset = [];
    for (let i = 0; i < this.numberOfValues; i++) {
      const day = new Date(this.dateTo);
      day.setDate(day.getDate() - i);

      const daynumber = day.getDate();
      let proteinForDay: number;
      let fatForDay: number;
      let carbsForDay: number;
      if (type === 'calories') {
        proteinForDay =
          this.getMacroForDay(day, this.numberOfValues, 'protein') * 4;
        fatForDay = this.getMacroForDay(day, this.numberOfValues, 'fat') * 9;
        carbsForDay =
          this.getMacroForDay(day, this.numberOfValues, 'carbs') * 4;
      } else {
        proteinForDay = this.getMacroForDay(
          day,
          this.numberOfValues,
          'protein'
        );
        fatForDay = this.getMacroForDay(day, this.numberOfValues, 'fat');
        carbsForDay = this.getMacroForDay(day, this.numberOfValues, 'carbs');
      }
      const total = proteinForDay + fatForDay + carbsForDay;

      const proteinDataPoint = new DataPoint(daynumber, proteinForDay);
      const fatDataPoint = new DataPoint(daynumber, fatForDay);
      const carbsDataPoint = new DataPoint(daynumber, carbsForDay);

      const proteinRatioDataPoint = new DataPoint(
        daynumber,
        (proteinForDay / total) * 100
      );
      const fatRatioDataPoint = new DataPoint(
        daynumber,
        (fatForDay / total) * 100
      );
      const carbsRatioDataPoint = new DataPoint(
        daynumber,
        (carbsForDay / total) * 100
      );

      carbsDataset.push(carbsDataPoint);
      fatDataset.push(fatDataPoint);
      proteinDataset.push(proteinDataPoint);
      proteinRatioDataset.push(proteinRatioDataPoint);
      fatRatioDataset.push(fatRatioDataPoint);
      carbsRatioDataset.push(carbsRatioDataPoint);
    }
    this.carbsDataset = carbsDataset;
    this.fatDataset = fatDataset;
    this.proteinDataset = proteinDataset;

    this.proteinRatioDataset = proteinRatioDataset;
    this.fatRatioDataset = fatRatioDataset;
    this.carbsRatioDataset = carbsRatioDataset;
    this.reverseDatasets();

    const totalGoals =
      this.userGoals[0] + this.userGoals[1] + this.userGoals[2];

    if (type === 'calories') {
      this.proteinMarker = this.userGoals[0] * 4;
      this.fatMarker = this.userGoals[1] * 9;
      this.carbsMarker = this.userGoals[2] * 4;
      this.markers = [this.goalCalories];

      const ratioProteinMarker = Math.round(
        (this.proteinMarker / this.goalCalories) * 100
      );
      const ratioFatMarker = Math.round(
        (this.fatMarker / this.goalCalories) * 100
      );
      const ratioCarbsMarker = Math.round(
        (this.carbsMarker / this.goalCalories) * 100
      );

      this.ratioMarkers = [
        ratioProteinMarker,
        ratioFatMarker,
        ratioCarbsMarker,
      ];
      this.yAxisStep = 200;
    } else {
      this.proteinMarker = this.userGoals[0];
      this.fatMarker = this.userGoals[1];
      this.carbsMarker = this.userGoals[2];
      this.markers = [this.proteinMarker, this.fatMarker, this.carbsMarker];

      const ratioProteinMarker = Math.round(
        (this.proteinMarker / totalGoals) * 100
      );
      const ratioFatMarker = Math.round((this.fatMarker / totalGoals) * 100);
      const ratioCarbsMarker = Math.round(
        (this.carbsMarker / totalGoals) * 100
      );

      this.ratioMarkers = [
        ratioProteinMarker,
        ratioFatMarker,
        ratioCarbsMarker,
      ];
      this.yAxisStep = 20;
    }
  }

  private reverseDatasets(): void {
    this.carbsDataset.reverse();
    this.fatDataset.reverse();
    this.proteinDataset.reverse();

    this.proteinRatioDataset.reverse();
    this.fatRatioDataset.reverse();
    this.carbsRatioDataset.reverse();
  }

  private setGoalCalories() {
    if (this.userGoals) {
      this.goalCalories =
        this.userGoals[0] * 4 + this.userGoals[1] * 9 + this.userGoals[2] * 4;
    }
  }

  private getMacroForDay(date: Date, numberOfValues: number, macro: string) {
    let indexMax = Math.min(numberOfValues, this.allMacros.length);
    for (let i = 0; i < indexMax; i++) {
      const macrosPerDay = this.allMacros[i];
      const macrosString = format(new Date(macrosPerDay.day), 'yyyy-MM-dd');
      const dateString = format(date, 'yyyy-MM-dd');
      if (macrosPerDay && macrosString === dateString) {
        return Math.round(macrosPerDay.macro[macro as keyof Macros]);
      }
    }
    return undefined;
  }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DiaryService } from '../../services/diary.service';
import { UserService } from '../../services/user.service';
import * as moment from 'moment';
import { MacrosPerDay } from '@app/model/macrosPerDay';
import { DataPoint } from '@app/components/linegraph/linegraph.component';


@Component({
  selector: 'graphs',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class GraphsComponent implements OnInit {

  constructor(
    private logService: DiaryService,
    private userService: UserService, 
    private ref: ChangeDetectorRef) {
  }

  public measurement = 'calories';
  public measurementOption = 'total';

  public splitted = false;
  public percentages = false;
  public loading = true;

  private userGoals;
  private goalCalories = 0;

  private allMacros: MacrosPerDay[] = [];

  private dateFrom: Date;
  private dateTo: Date;

  public yAxisStep = 20;

  public graphLabel = 'Total calories per day grouped by macronutrient';
  public proteinGraphLabel = 'Protein';
  public fatGraphLabel = 'Fat';
  public carbsGraphLabel = 'Carbs'

  public carbsDataset: DataPoint[];
  public fatDataset: DataPoint[];
  public proteinDataset: DataPoint[];

  public proteinMarker: number;
  public fatMarker: number;
  public carbsMarker: number;
  public markers = [];

  private numberOfValues: number = 30;
  // Types of graphs:
  // Grams
  //    Total grams per day grouped by macros -- done
  //    Splitted total grams per day per macro -- done
  //    Percentage/ratio gramps per marco per day
  // Energy (calories)
  //    Total calories per day grouped by macros -- done
  //    Splitted total calories per day per macro -- done
  //    Percentage/ratio calories per macro per day (streched bars)

  ngOnInit() {
    this.dateTo = new Date();
    this.dateFrom = new Date();
    this.dateFrom.setMonth(this.dateFrom.getMonth() - 1);
    this.dateFrom.setDate(this.dateFrom.getDate() + 1);
    this.getLogData();
  }

  public switchMeasurement() {
    if (this.measurement === 'grams') {
      this.getGramsDatasets();
      this.graphLabel = 'Total grams per day grouped by macronutrient'
      this.markers = [this.proteinMarker, this.fatMarker, this.carbsMarker];
    } else {
      this.getCaloriesDatasets();
      this.graphLabel = 'Total calories per day grouped by macronutrient'
      this.markers = [this.goalCalories];
    }
  }

  public switchOption() {
    if (this.measurementOption === 'total') {

    } else if (this.measurementOption === 'splitted') {

    } else {

    }
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
    this.logService.getMacrosPerDay(moment(this.dateFrom).format('YYYY-MM-DD'), moment(this.dateTo).format('YYYY-MM-DD')).subscribe(
      data => {
        this.allMacros = data;
        this.getGoals();
      },
      error => {
        console.log(error);
        this.allMacros = [];
      });
  }

  private getGoals() {
    this.userService.getUserGoalStats(moment(this.dateFrom).format('YYYY-MM-DD')).subscribe(
      data => {
        if (data[0] === null) {
          this.userGoals = null;
        } else {
          this.userGoals = data;
        }
        this.setGoalCalories();
        this.numberOfValues = ((this.dateTo.getTime() - this.dateFrom.getTime()) / 1000 / 60 / 60 / 24) + 1;
        this.getDatasets();
        this.loading = false;
      },
      error => console.log(error)
    );
  }

  private getDatasets() {
    if (this.measurement === 'grams') {
      this.getGramsDatasets();
    } else {
      this.getCaloriesDatasets();
    }
  }

  private getGramsDatasets() {
    const carbsDataset = []
    const fatDataset = []
    const proteinDataset = []
    for (let i = 0; i < this.numberOfValues; i++) {
      const day = new Date(this.dateTo);
      day.setDate(day.getDate() - i);

      const daynumber = day.getDate();
      const carbsDataPoint = new DataPoint(daynumber, this.getMacroForDay(day, this.numberOfValues, 'carbs'));
      const fatDataPoint = new DataPoint(daynumber, this.getMacroForDay(day, this.numberOfValues, 'fat'));
      const proteinDataPoint = new DataPoint(daynumber, this.getMacroForDay(day, this.numberOfValues, 'protein'));

      carbsDataset.push(carbsDataPoint)
      fatDataset.push(fatDataPoint)
      proteinDataset.push(proteinDataPoint)
    }
    this.carbsDataset = carbsDataset;
    this.carbsDataset.reverse();
    this.fatDataset = fatDataset;
    this.fatDataset.reverse();
    this.proteinDataset = proteinDataset;
    this.proteinDataset.reverse();

    this.proteinMarker = this.userGoals[0];
    this.fatMarker = this.userGoals[1];
    this.carbsMarker = this.userGoals[2];
    this.markers = [this.proteinMarker, this.fatMarker, this.carbsMarker];
    this.yAxisStep = 20;
  }

  private getCaloriesDatasets() {
    const carbsDataset = []
    const fatDataset = []
    const proteinDataset = []
    for (let i = 0; i < this.numberOfValues; i++) {
      const day = new Date(this.dateTo);
      day.setDate(day.getDate() - i);

      const daynumber = day.getDate();
      const carbsDataPoint = new DataPoint(daynumber, this.getMacroForDay(day, this.numberOfValues, 'carbs') * 4);
      const fatDataPoint = new DataPoint(daynumber, this.getMacroForDay(day, this.numberOfValues, 'fat') * 9);
      const proteinDataPoint = new DataPoint(daynumber, this.getMacroForDay(day, this.numberOfValues, 'protein') * 4);

      carbsDataset.push(carbsDataPoint)
      fatDataset.push(fatDataPoint)
      proteinDataset.push(proteinDataPoint)
    }
    this.carbsDataset = carbsDataset;
    this.carbsDataset.reverse();
    this.fatDataset = fatDataset;
    this.fatDataset.reverse();
    this.proteinDataset = proteinDataset;
    this.proteinDataset.reverse();

    this.proteinMarker = this.userGoals[0] * 4
    this.fatMarker = this.userGoals[1] * 9
    this.carbsMarker = this.userGoals[2] * 4;
    this.markers = [this.proteinMarker, this.fatMarker, this.carbsMarker];
    this.yAxisStep = 200;
  }

  private setGoalCalories() {
    if (this.userGoals) {
      this.goalCalories = (this.userGoals[0] * 4) + (this.userGoals[1] * 9) + (this.userGoals[2] * 4);
    }
  }

  private getMacroForDay(date: Date, numberOfValues: number, macro: string) {
    for (let i = 0; i < numberOfValues; i++) {
      const macrosPerDay = this.allMacros[i];
      if (macrosPerDay && moment(macrosPerDay.day).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')) {
        return Math.round(macrosPerDay.macro[macro]);
      }
    }
    return undefined;
  }

  private getPercentageDatasets() {
    const newProtein = [];
    const newFat = [];
    const newCarbs = []
    const prcGoalEnergyFromProtein = (this.userGoals[0] * 4) / this.goalCalories * 100;
    const prcGoalEnergyFromFat = (this.userGoals[1] * 9) / this.goalCalories * 100;
    const prcGoalEnergyFromCarbs = (this.userGoals[2] * 4) / this.goalCalories * 100;
    const proteinConversionFactor = this.userGoals[0] / prcGoalEnergyFromProtein;
    const fatConversionFactor = this.userGoals[1] / prcGoalEnergyFromFat;
    const carbsConversionFactor = this.userGoals[2] / prcGoalEnergyFromCarbs;
    for (let i = 0; i < this.proteinDataset.length; i++) {
      const proteinDataPoint = new DataPoint(this.proteinDataset[i].x, Math.round(this.proteinDataset[i].y / proteinConversionFactor));
      const fatDataPoint = new DataPoint(this.fatDataset[i].x, Math.round(this.fatDataset[i].y / fatConversionFactor));
      const carbsDataPoint = new DataPoint(this.carbsDataset[i].x, Math.round(this.carbsDataset[i].y / carbsConversionFactor));
      if (!proteinDataPoint.y) {
        proteinDataPoint.y = 0;
      }
      if (!fatDataPoint.y) {
        fatDataPoint.y = 0;
      }
      if (!carbsDataPoint.y) {
        carbsDataPoint.y = 0;
      }
      newProtein.push(proteinDataPoint);
      newFat.push(fatDataPoint);
      newCarbs.push(carbsDataPoint);
    }
    this.proteinDataset = newProtein;
    this.fatDataset = newFat;
    this.carbsDataset = newCarbs;

    this.proteinMarker = Math.round(prcGoalEnergyFromProtein);
    this.fatMarker = Math.round(prcGoalEnergyFromFat);
    this.carbsMarker = Math.round(prcGoalEnergyFromCarbs);
  }
}

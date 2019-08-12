import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
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
    private userService: UserService) {
  }

  public splitted = false;
  public percentages = false;
  public loading = true;

  private userGoals;
  private goalCalories = 0;

  private allMacros: MacrosPerDay[] = [];

  private dateFrom: Date;
  private dateTo: Date;

  public calorieDataset: DataPoint[];
  public carbsDataset: DataPoint[];
  public fatDataset: DataPoint[];
  public proteinDataset: DataPoint[];

  public proteinMarker: number;
  public fatMarker: number;
  public carbsMarker: number;

  ngOnInit() {
    this.dateTo = new Date();
    this.dateFrom = new Date();
    this.dateFrom.setMonth(this.dateFrom.getMonth() - 1);
    this.dateFrom.setDate(this.dateFrom.getDate() + 1);
    this.getLogData();
  }

  public switchSplitted() {
    this.getDatasets();
  }

  public switchPercentages() {
    if (this.percentages) {
      this.getPercentageDatasets();
    } else {
      this.getDatasets();
    }
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
        this.getDatasets();
        this.loading = false;
      },
      error => console.log(error)
    );
  }

  private getDatasets() {
    const calorieDataset = [];
    const carbsDataset = []
    const fatDataset = []
    const proteinDataset = []
    const numberOfValues = ((this.dateTo.getTime() - this.dateFrom.getTime()) / 1000 / 60 / 60 / 24) + 1;
    for (let i = 0; i < numberOfValues; i++) {
      const day = new Date(this.dateTo);
      day.setDate(day.getDate() - i);

      const daynumber = day.getDate();
      const caloriesDataPoint = new DataPoint(daynumber, this.getMacroForDay(day, numberOfValues, 'calories'));
      const carbsDataPoint = new DataPoint(daynumber, this.getMacroForDay(day, numberOfValues, 'carbs'));
      const fatDataPoint = new DataPoint(daynumber, this.getMacroForDay(day, numberOfValues, 'fat'));
      const proteinDataPoint = new DataPoint(daynumber, this.getMacroForDay(day, numberOfValues, 'protein'));

      calorieDataset.push(caloriesDataPoint);
      carbsDataset.push(carbsDataPoint)
      fatDataset.push(fatDataPoint)
      proteinDataset.push(proteinDataPoint)
    }
    this.calorieDataset = calorieDataset;
    this.calorieDataset.reverse();
    this.carbsDataset = carbsDataset;
    this.carbsDataset.reverse();
    this.fatDataset = fatDataset;
    this.fatDataset.reverse();
    this.proteinDataset = proteinDataset;
    this.proteinDataset.reverse();

    this.proteinMarker = this.userGoals[0];
    this.fatMarker = this.userGoals[1];
    this.carbsMarker = this.userGoals[2];
    console.log(this.proteinDataset);
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

import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { AfterContentInit } from '@angular/core';
import { DiaryService } from '../../services/diary.service';
import { UserService } from '../../services/user.service';
import * as moment from 'moment';
import { LogEntry } from '@app/model/logEntry';
import { MacrosPerDay } from '@app/model/macrosPerDay';

@Component({
  selector: 'graphs',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class GraphsComponent implements OnInit, AfterViewInit {

  @ViewChild('macroSvg', { static: false }) public macroSvgElement: ElementRef;
  @ViewChild('calorieSvg', { static: false }) public calorieSvgElement: ElementRef;

  constructor(
    private logService: DiaryService,
    private userService: UserService) {
  }

  public macroSvgHeight = 500; //TODO get from viewchild
  public calorieSvgHeight = 250;
  private barWidth = 20;
  private marginLeft = 70;

  private graphLegenda = 20;

  private splitted = true;
  private percentages = false;

  private zoomX = 1;
  private zoomXCalories = 1;

  private splitOffset = 10;

  private maxProtein = 0;
  private maxFat = 0;
  private maxCarbs = 0;
  private maxTotal = 0;
  private maxCalories = 0;

  private maxProteinPerc = 0;
  private maxFatPerc = 0;
  private maxCarbsPerc = 0;

  private userGoals;
  private goalCalories = 0;

  public loading = true;
  private allMacros: MacrosPerDay[] = [];
  private infoMacro = null;

  private macroBars: MacrosPerDay[] = [];

  private dateFrom: Date;
  private dateTo: Date;

  ngOnInit() {
    this.dateTo = new Date();
    this.dateFrom = new Date();
    this.dateFrom.setMonth(this.dateFrom.getMonth() - 1);
    this.getLogData();
  }

  ngAfterViewInit() {
    // this.macroSvgHeight = this.macroSvgElement.nativeElement.clientHeight;
    // this.calorieSvgHeight = this.calorieSvgElement.nativeElement.clientWidth;
  }

  getSVGWidth() {
    return this.marginLeft + 33 * this.barWidth;
  }

  getLogData() {
    this.loading = true;
    this.allMacros = [];
    this.macroBars = [];
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

  getGoals() {
    this.userService.getUserGoalStats(moment(this.dateFrom).format('YYYY-MM-DD')).subscribe(
      data => {
        if (data[0] === null) {
          this.userGoals = null;
        } else {
          this.userGoals = data;
        }
        this.setGoalCalories();
        this.filterMacrosForMonth();
        this.calculateZoom();
        this.loading = false;
      },
      error => console.log(error)
    );
  }

  private setGoalCalories() {
    if (this.userGoals) {
      this.goalCalories = (this.userGoals[0] * 4) + (this.userGoals[1] * 9) + (this.userGoals[2] * 4);
    }
  }

  filterMacrosForMonth() {
    const pointerDate = new Date(this.dateFrom);

    while (pointerDate < this.dateTo) {
      const macrosForPointerDate = this.allMacros.filter(macrosPerDay => moment(macrosPerDay.day).format('YYYY-MM-DD') === moment(pointerDate).format('YYYY-MM-DD'))[0];
      if (macrosForPointerDate) {
        const total = macrosForPointerDate.macro.protein + macrosForPointerDate.macro.fat + macrosForPointerDate.macro.carbs;
        this.maxProtein = Math.max(this.maxProtein, macrosForPointerDate.macro.protein);
        this.maxFat = Math.max(this.maxFat, macrosForPointerDate.macro.fat);
        this.maxCarbs = Math.max(this.maxCarbs, macrosForPointerDate.macro.carbs);
        this.maxTotal = Math.max(this.maxTotal, macrosForPointerDate.macro.protein + macrosForPointerDate.macro.fat + macrosForPointerDate.macro.carbs);
        this.maxCalories = Math.max(this.maxCalories, macrosForPointerDate.macro.calories);

        this.maxProteinPerc = Math.max(this.maxProteinPerc, macrosForPointerDate.macro.protein * 100 / total);
        this.maxFatPerc = Math.max(this.maxFatPerc, macrosForPointerDate.macro.fat * 100 / total);
        this.maxCarbsPerc = Math.max(this.maxCarbsPerc, macrosForPointerDate.macro.carbs * 100 / total);

        this.macroBars.push(macrosForPointerDate);
      } else {
        const newDate = new Date(pointerDate);
        this.macroBars.push(new MacrosPerDay(newDate));
      }
      pointerDate.setDate(pointerDate.getDate() + 1);
    }
  }

  monthBack() {
    this.dateTo = new Date(this.dateFrom);
    this.dateFrom.setMonth(this.dateFrom.getMonth() - 1);
    this.getLogData();

  }
  monthForward() {
    this.dateFrom = new Date(this.dateTo);
    this.dateTo.setMonth(this.dateTo.getMonth() + 1);
    this.getLogData();
  }

  getYPosProtein(macrosPerDay: MacrosPerDay): number {
    return this.macroSvgHeight - this.graphLegenda - this.getHeightProtein(macrosPerDay);
  }

  getHeightProtein(macrosPerDay: MacrosPerDay): number {
    if (!macrosPerDay || !macrosPerDay.macro || !macrosPerDay.macro.protein) {
      return 0;
    }
    if (this.percentages) {
      const total = macrosPerDay.macro.protein + macrosPerDay.macro.fat + macrosPerDay.macro.carbs;
      const percentage = macrosPerDay.macro.protein * 100 / total;
      return percentage * this.zoomX;
    } else {
      return macrosPerDay.macro.protein * this.zoomX;
    }
  }

  getYPosCalories(macrosPerDay: MacrosPerDay): number {
    return this.calorieSvgHeight - this.graphLegenda - this.getHeightCalories(macrosPerDay);
  }

  getHeightCalories(macrosPerDay: MacrosPerDay): number {
    if (!macrosPerDay || !macrosPerDay.macro || !macrosPerDay.macro.calories) {
      return 0;
    }
    return macrosPerDay.macro.calories * this.zoomXCalories;
  }

  getYPosFat(macrosPerDay: MacrosPerDay): number {
    if (this.splitted) {
      if (this.percentages) {
        return this.macroSvgHeight - this.graphLegenda - (this.splitOffset + this.maxProteinPerc * this.zoomX + this.getHeightFat(macrosPerDay));
      } else {
        return this.macroSvgHeight - this.graphLegenda - (this.splitOffset + this.maxProtein * this.zoomX + this.getHeightFat(macrosPerDay));
      }
    } else {
      return this.macroSvgHeight - this.graphLegenda - (this.getHeightProtein(macrosPerDay) + this.getHeightFat(macrosPerDay));
    }
  }

  getHeightFat(macrosPerDay: MacrosPerDay): number {
    if (!macrosPerDay || !macrosPerDay.macro || !macrosPerDay.macro.fat) {
      return 0;
    }
    if (this.percentages) {
      const total = macrosPerDay.macro.protein + macrosPerDay.macro.fat + macrosPerDay.macro.carbs;
      const percentage = macrosPerDay.macro.fat * 100 / total;
      return percentage * this.zoomX;
    } else {
      return macrosPerDay.macro.fat * this.zoomX;
    }
  }

  getYPosCarbs(macrosPerDay: MacrosPerDay): number {
    if (this.splitted) {
      if (this.percentages) {
        const maxUsed = this.maxProteinPerc + this.maxFatPerc;
        return this.macroSvgHeight - this.graphLegenda - (this.splitOffset * 2 + maxUsed * this.zoomX + this.getHeightCarbs(macrosPerDay));
      } else {
        return this.macroSvgHeight - this.graphLegenda - (this.splitOffset * 2 + this.maxProtein * this.zoomX + this.maxFat * this.zoomX + this.getHeightCarbs(macrosPerDay));
      }
    } else {
      return this.macroSvgHeight - this.graphLegenda - (this.getHeightProtein(macrosPerDay) + this.getHeightFat(macrosPerDay) + this.getHeightCarbs(macrosPerDay));
    }
  }

  getHeightCarbs(macrosPerDay: MacrosPerDay): number {
    if (!macrosPerDay || !macrosPerDay.macro || !macrosPerDay.macro.carbs) {
      return 0;
    }
    if (this.percentages) {
      const total = macrosPerDay.macro.protein + macrosPerDay.macro.fat + macrosPerDay.macro.carbs;
      const percentage = macrosPerDay.macro.carbs * 100 / total;
      return percentage * this.zoomX;
    } else {
      return macrosPerDay.macro.carbs * this.zoomX;
    }
  }

  getGoalProteinPos(): number {
    return this.getYPosProtein(null) - this.getGoal('protein') * this.zoomX;
  }

  getGoalFatPos(): number {
    if (this.splitted) {
      return this.getYPosFat(null) - this.getGoal('fat') * this.zoomX;
    } else {
      return this.getYPosFat(null) - (this.getGoal('fat') * this.zoomX + this.getGoal('protein') * this.zoomX);
    }
  }

  getGoalCarbsPos(): number {
    if (this.splitted) {
      return this.getYPosCarbs(null) - this.getGoal('carbs') * this.zoomX;
    } else {
      return this.getYPosCarbs(null) - (this.getGoal('protein') * this.zoomX + this.getGoal('fat') * this.zoomX + this.getGoal('carbs') * this.zoomX);
    }
  }

  getGoalCaloriesPos(): number {
    return this.getYPosCalories(null) - (this.getGoalCalories() * this.zoomXCalories);
  }

  getGoalCalories() {
    return this.goalCalories;
  }

  getGoal(macro: string) {
    let index = -1;
    switch (macro) {
      case 'protein': index = 0;
        break;
      case 'fat': index = 1;
        break;
      case 'carbs': index = 2;
    }
    if (this.percentages) {
      const total = this.userGoals[0] + this.userGoals[1] + this.userGoals[2];
      const percentage = this.userGoals[index] * 100 / total;
      return percentage;
    } else {
      return this.userGoals[index];
    }
  }

  calculateZoom() {
    if (!this.macroSvgHeight) {
      this.zoomX = 0;
      this.zoomXCalories = 0;
      return;
    }

    if (this.percentages) {
      if (this.splitted) {
        this.zoomX = (this.macroSvgHeight - 40) / (this.maxProteinPerc + this.maxFatPerc + this.maxCarbsPerc);
      } else {
        this.zoomX = (this.macroSvgHeight - 40) / 100;
      }
    } else {
      if (this.splitted) {
        this.zoomX = (this.macroSvgHeight - 40) / (this.maxProtein + this.maxFat + this.maxCarbs);
      } else {
        this.zoomX = (this.macroSvgHeight - 40) / this.maxTotal;
      }
    }
    this.zoomXCalories = (this.calorieSvgHeight - 40) / this.maxCalories;
  }

  public showMacros(macrosPerDay: MacrosPerDay) {
    if (macrosPerDay.macro) {
      this.infoMacro = macrosPerDay;
    } else {
      this.infoMacro = null;
    }
  }

}

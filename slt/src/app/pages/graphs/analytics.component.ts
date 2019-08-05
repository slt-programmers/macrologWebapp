import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AfterContentInit } from '@angular/core';
import { DiaryService } from '../../services/diary.service';
import { UserService } from '../../services/user.service';
import * as moment from 'moment';

@Component({
  selector: 'graphs',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class GraphsComponent implements AfterViewInit, AfterContentInit {

  @ViewChild('macroSvg', { static: false }) public macroSvgElement: ElementRef;
  @ViewChild('calorieSvg', { static: false }) public calorieSvgElement: ElementRef;

  constructor(private logService: DiaryService,
    private userService: UserService) { }

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
  private goalCal;

  public loading = true;
  private allLogs = new Array();
  private infoMacro = null;

  private logBars = new Array();

  private dateFrom;
  private dateTo;

  ngAfterViewInit() {
    // this.macroSvgHeight = this.macroSvgElement.nativeElement.clientHeight;
    // this.calorieSvgHeight = this.calorieSvgElement.nativeElement.clientWidth;
  }

  ngAfterContentInit() {
    this.dateFrom = moment().subtract(1, 'months');
    this.dateTo = moment();
    this.getData();
    this.getGoals();
  }

  getSVGWidth() {
    return this.marginLeft + 33 * this.barWidth;
  }

  getData() {
    this.loading = true;
    this.getGoals();
    this.logBars = new Array();
    this.allLogs = new Array();
    this.logService.getMacros(this.dateFrom.format('YYYY-MM-DD'), this.dateTo.format('YYYY-MM-DD')).subscribe(
      data => {
        this.allLogs = data;
        this.matchLogs();
        this.calculateZoom();
        this.loading = false;
      },
      error => {
        console.log(error);
        this.allLogs = new Array();
      });
  }

  getGoals() {
    this.userService.getUserGoalStats(this.dateFrom.format('YYYY-MM-DD')).subscribe(
      data => {
        if (data[0] === null) {
          this.userGoals = null;
        } else {
          this.userGoals = data;
        }
        this.setGoalCal();
      },
      error => console.log(error)
    );
  }

  private setGoalCal() {
    if (this.userGoals) {
      this.goalCal = (this.userGoals[0] * 4) + (this.userGoals[1] * 9) + (this.userGoals[2] * 4);
    }
  }

  matchLogs() {
    const pointerDate = this.dateFrom.clone();
    while (pointerDate.isBefore(this.dateTo)) {
      const filtered = this.allLogs.filter(i => i.day === pointerDate.format('YYYY-MM-DD'))[0];
      if (filtered) {
        const total = filtered.macro.protein + filtered.macro.fat + filtered.macro.carbs;

        this.maxProtein = Math.max(this.maxProtein, filtered.macro.protein);
        this.maxFat = Math.max(this.maxFat, filtered.macro.fat);
        this.maxCarbs = Math.max(this.maxCarbs, filtered.macro.carbs);
        this.maxTotal = Math.max(this.maxTotal, filtered.macro.protein + filtered.macro.fat + filtered.macro.carbs);
        this.maxCalories = Math.max(this.maxCalories, filtered.macro.calories);

        this.maxProteinPerc = Math.max(this.maxProteinPerc, filtered.macro.protein * 100 / total);
        this.maxFatPerc = Math.max(this.maxFatPerc, filtered.macro.fat * 100 / total);
        this.maxCarbsPerc = Math.max(this.maxCarbsPerc, filtered.macro.carbs * 100 / total);

        this.logBars.push(filtered);
      } else {
        this.logBars.push({ 'day': pointerDate.format('YYYY-MM-DD') });
      }
      pointerDate.add(1, 'day');
    }
  }

  monthBack() {
    this.dateTo = this.dateFrom.clone();
    this.dateFrom = this.dateFrom.clone().subtract(1, 'months');
    this.getData();

  }
  monthForward() {
    this.dateFrom = this.dateTo.clone();
    this.dateTo = this.dateTo.clone().add(1, 'months');
    this.getData();
  }

  getYPosProtein(logEntry) {
    return this.macroSvgHeight - this.graphLegenda - this.getHeightProtein(logEntry);
  }

  getYPosCalories(logEntry) {
    return this.calorieSvgHeight - this.graphLegenda - this.getHeightCalories(logEntry);
  }

  getHeightCalories(logEntry) {
    if (!logEntry || !logEntry.macro) {
      return 0;
    }
    return logEntry.macro.calories * this.zoomXCalories;
  }

  getHeightProtein(logEntry) {
    if (!logEntry || !logEntry.macro) {
      return 0;
    }
    if (this.percentages) {
      const total = logEntry.macro.protein + logEntry.macro.fat + logEntry.macro.carbs;
      const percentage = logEntry.macro.protein * 100 / total;
      return percentage * this.zoomX;
    } else {
      return logEntry.macro.protein * this.zoomX;
    }
  }

  getYPosFat(logEntry) {
    if (this.splitted) {
      if (this.percentages) {
        return this.macroSvgHeight - this.graphLegenda - (this.splitOffset + this.maxProteinPerc * this.zoomX + this.getHeightFat(logEntry));
      } else {
        return this.macroSvgHeight - this.graphLegenda - (this.splitOffset + this.maxProtein * this.zoomX + this.getHeightFat(logEntry));
      }
    } else {
      return this.macroSvgHeight - this.graphLegenda - (this.getHeightProtein(logEntry) + this.getHeightFat(logEntry));
    }
  }
  getHeightFat(logEntry) {
    if (!logEntry || !logEntry.macro) {
      return 0;
    }
    if (this.percentages) {
      const total = logEntry.macro.protein + logEntry.macro.fat + logEntry.macro.carbs;
      const percentage = logEntry.macro.fat * 100 / total;
      return percentage * this.zoomX;
    } else {
      return logEntry.macro.fat * this.zoomX;
    }
  }

  getYPosCarbs(logEntry) {
    if (this.splitted) {
      if (this.percentages) {
        const maxUsed = this.maxProteinPerc + this.maxFatPerc;
        return this.macroSvgHeight - this.graphLegenda - (this.splitOffset * 2 + maxUsed * this.zoomX + this.getHeightCarbs(logEntry));
      } else {
        return this.macroSvgHeight - this.graphLegenda - (this.splitOffset * 2 + this.maxProtein * this.zoomX + this.maxFat * this.zoomX + this.getHeightCarbs(logEntry));
      }
    } else {
      return this.macroSvgHeight - this.graphLegenda - (this.getHeightProtein(logEntry) + this.getHeightFat(logEntry) + this.getHeightCarbs(logEntry));
    }
  }

  getHeightCarbs(logEntry) {
    if (!logEntry || !logEntry.macro) {
      return 0;
    }
    if (this.percentages) {
      const total = logEntry.macro.protein + logEntry.macro.fat + logEntry.macro.carbs;
      const percentage = logEntry.macro.carbs * 100 / total;
      return percentage * this.zoomX;
    } else {
      return logEntry.macro.carbs * this.zoomX;
    }
  }

  getGoalProteinPos() {
    return this.getYPosProtein(null) - this.getGoal('protein') * this.zoomX;
  }

  getGoalFatPos() {
    if (this.splitted) {
      return this.getYPosFat(null) - this.getGoal('fat') * this.zoomX;
    } else {
      return this.getYPosFat(null) - (this.getGoal('fat') * this.zoomX + this.getGoal('protein') * this.zoomX);
    }
  }

  getGoalCarbsPos() {
    if (this.splitted) {
      return this.getYPosCarbs(null) - this.getGoal('carbs') * this.zoomX;
    } else {
      return this.getYPosCarbs(null) - (this.getGoal('protein') * this.zoomX + this.getGoal('fat') * this.zoomX + this.getGoal('carbs') * this.zoomX);
    }
  }

  getGoalCaloriesPos() {
    return this.getYPosCalories(null) - (this.getGoalCalories() * this.zoomXCalories);
  }
  getGoalCalories() {
    return this.goalCal;
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

  public showMacros(logEntry) {
    if (logEntry.macro) {
      this.infoMacro = logEntry;
    } else {
      this.infoMacro = null;
    }
  }

}
import { Component } from '@angular/core';
import { AfterContentInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { LogService } from '../../services/log.service';
import { UserService } from '../../services/user.service';
import * as moment from 'moment';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html'
})
export class GraphsComponent implements AfterContentInit {

  @ViewChild('svgcontainer', { static: false }) dataContainer: ElementRef;

  constructor(private logService: LogService,
    private userService: UserService) { }

  private barWidth = 20;
  private radius = 30;
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

  private clientWidth = 0;
  private clientHeight = 0;

  private userGoals;
  private goalCal;

  public loading = true;
  private allLogs = new Array();
  private infoMacro = null;

  private logBars = new Array();

  private dateFrom;
  private dateTo;

  ngAfterContentInit() {
    this.dateFrom = moment().subtract(1, 'months');
    this.dateTo = moment();
    this.getData();
    this.getGoals();
  }

  getSVGWidth() {
    return this.marginLeft + 33 * this.barWidth;
  }
  getSVGHeight() {
    return this.clientHeight * 0.66;
  }

  getSVGHeightCalories() {
    return this.clientHeight * 0.33;
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
        this.clientHeight = this.dataContainer.nativeElement.clientHeight * 0.8;
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
    if (this.splitted) {
      return this.getSVGHeight() - this.graphLegenda - this.getHeightProtein(logEntry);
    } else {
      return this.getSVGHeight() - this.graphLegenda - this.getHeightProtein(logEntry);
    }
  }

  getYPosCalories(logEntry) {
    return this.getSVGHeightCalories() - this.graphLegenda - this.getHeightCalories(logEntry);
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
        return this.getSVGHeight() - this.graphLegenda - (this.splitOffset + this.maxProteinPerc * this.zoomX + this.getHeightFat(logEntry));
      } else {
        return this.getSVGHeight() - this.graphLegenda - (this.splitOffset + this.maxProtein * this.zoomX + this.getHeightFat(logEntry));
      }

    } else {
      return this.getSVGHeight() - this.graphLegenda - (this.getHeightProtein(logEntry) + this.getHeightFat(logEntry));
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
        return this.getSVGHeight() - this.graphLegenda - (this.splitOffset * 2 + maxUsed * this.zoomX + this.getHeightCarbs(logEntry));
      } else {
        return this.getSVGHeight() - this.graphLegenda - (this.splitOffset * 2 + this.maxProtein * this.zoomX + this.maxFat * this.zoomX + this.getHeightCarbs(logEntry));
      }
    } else {
      return this.getSVGHeight() - this.graphLegenda - (this.getHeightProtein(logEntry) + this.getHeightFat(logEntry) + this.getHeightCarbs(logEntry));
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
    if (this.percentages) {
      return this.getYPosProtein(null) - this.getGoalProtein() * this.zoomX;
    } else {
      return this.getYPosProtein(null) - this.getGoalProtein() * this.zoomX;
    }
  }

  getGoalFatPos() {
    if (this.splitted) {
      return this.getYPosFat(null) - this.getGoalFat() * this.zoomX;
    } else {
      return this.getYPosFat(null) - (this.getGoalFat() * this.zoomX + this.getGoalProtein() * this.zoomX);
    }
  }

  getGoalCarbsPos() {
    if (this.splitted) {
      return this.getYPosCarbs(null) - this.getGoalCarbs() * this.zoomX;
    } else {
      return this.getYPosCarbs(null) - (this.getGoalProtein() * this.zoomX + this.getGoalFat() * this.zoomX + this.getGoalCarbs() * this.zoomX);
    }
  }

  getGoalCaloriesPos() {
    return this.getYPosCalories(null) - (this.getGoalCalories() * this.zoomXCalories);
  }
  getGoalCalories() {
    return this.goalCal;
  }

  getGoalProtein() {
    if (this.percentages) {
      const total = this.userGoals[0] + this.userGoals[1] + this.userGoals[2];
      const percentage = this.userGoals[0] * 100 / total;
      return percentage;
    } else {
      return this.userGoals[0];
    }
  }

  getGoalFat() {
    if (this.percentages) {
      const total = this.userGoals[0] + this.userGoals[1] + this.userGoals[2];
      const percentage = this.userGoals[1] * 100 / total;
      return percentage;
    } else {
      return this.userGoals[1];
    }
  }

  getGoalCarbs() {
    if (this.percentages) {
      const total = this.userGoals[0] + this.userGoals[1] + this.userGoals[2];
      const percentage = this.userGoals[2] * 100 / total;
      return percentage;
    } else {
      return this.userGoals[2];
    }
  }

  calculateZoom() {
    if (!this.getSVGHeight()) {
      this.zoomX = 0;
      this.zoomXCalories = 0;
      return;
    }

    if (this.percentages) {
      if (this.splitted) {
        this.zoomX = (this.getSVGHeight() - 40) / (this.maxProteinPerc + this.maxFatPerc + this.maxCarbsPerc);
      } else {
        this.zoomX = (this.getSVGHeight() - 40) / 100;
      }
    } else {
      if (this.splitted) {
        this.zoomX = (this.getSVGHeight() - 40) / (this.maxProtein + this.maxFat + this.maxCarbs);
      } else {
        this.zoomX = (this.getSVGHeight() - 40) / this.maxTotal;
      }
    }
    this.zoomXCalories = (this.getSVGHeightCalories() - 40) / this.maxCalories;
  }

  public showMacros(logEntry) {
    if (logEntry.macro) {
      this.infoMacro = logEntry;
    } else {
      this.infoMacro = null;
    }
  }

}

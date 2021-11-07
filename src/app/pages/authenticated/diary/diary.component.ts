import { Component, OnInit, ViewChild } from '@angular/core';
import { DiaryService } from '../../../shared/services/diary.service';
import { ActivityService } from '../../../shared/services/activity.service';
import { UserService } from '../../../shared/services/user.service';
import { FoodService } from '../../../shared/services/food.service';
import { DishService } from '../../../shared/services/dish.service';
import { Entry } from '../../../shared/model/entry';
import { Activity } from '../../../shared/model/activity';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'diary-page',
  templateUrl: './diary.component.html',
  host: { '(document: click)': 'documentClick($event)' },
})
export class DiaryComponent implements OnInit {
  @ViewChild('breakfast', { static: false }) breakfastEref: any;
  @ViewChild('lunch', { static: false }) lunchEref: any;
  @ViewChild('dinner', { static: false }) dinnerEref: any;
  @ViewChild('snacks', { static: false }) snacksEref: any;
  @ViewChild('activities', { static: false }) activitiesEref: any;

  public modalIsVisible = false;
  public isLogMealOpen: boolean;
  public allLogs: Entry[];
  public displayDate: Date;
  private pipe: DatePipe;

  public breakfastLogs = new Array<Entry>();
  public lunchLogs = new Array<Entry>();
  public dinnerLogs = new Array<Entry>();
  public snacksLogs = new Array<Entry>();
  public activitiesLogs = new Array<Activity>();

  public breakfastOpen = false;
  public lunchOpen = false;
  public dinnerOpen = false;
  public snacksOpen = false;
  public activitiesOpen = false;

  public activititiesSync = false;
  public intakeGoals: any[];
  public goalCal: number;
  public circleRadius = 60;
  public strokeWidth = 8;

  constructor(private userService: UserService,
    private logService: DiaryService, private activityService: ActivityService,
    private readonly window: Window) {
    this.displayDate = new Date();
    this.pipe = new DatePipe('en-US');
  }

  ngOnInit() {
    this.getSyncSettings();
    this.getUserGoals(this.pipe.transform(this.displayDate, 'yyyy-MM-dd'));
    this.getLogEntries(this.pipe.transform(this.displayDate, 'yyyy-MM-dd'));
    if (this.window.innerWidth < 480) {
      this.circleRadius = 40;
      this.strokeWidth = 5;
    }
  }

  public refresh() {
    this.getLogEntries(this.pipe.transform(this.displayDate, 'yyyy-MM-dd'));
  }

  public forceSync() {
    this.activitiesLogs = [];
    this.activityService.getActivitiesForDateForced(
      this.pipe.transform(this.displayDate, 'yyyy-MM-dd')).subscribe(it => {
        this.activitiesLogs = it;
      });
  }

  public getTotal(macro: string): number {
    let total = 0.0;
    for (const logentry of this.breakfastLogs) {
      total += +logentry.macrosCalculated[macro];
    }
    for (const logentry of this.lunchLogs) {
      total += +logentry.macrosCalculated[macro];
    }
    for (const logentry of this.dinnerLogs) {
      total += +logentry.macrosCalculated[macro];
    }
    for (const logentry of this.snacksLogs) {
      total += +logentry.macrosCalculated[macro];
    }
    return total;
  }

  public getDifferentDay(event: any) {
    this.displayDate = event;
    this.breakfastOpen = false;
    this.lunchOpen = false;
    this.dinnerOpen = false;
    this.snacksOpen = false;
    this.activitiesOpen = false;
    this.getUserGoals(this.pipe.transform(this.displayDate, 'yyyy-MM-dd'));
    this.getLogEntries(this.pipe.transform(this.displayDate, 'yyyy-MM-dd'));
  }

  private getUserGoals(date: string): void {
    this.intakeGoals = [];
    this.userService.getUserGoalStats(date).subscribe(it => {
      this.intakeGoals = it
      this.setGoalCal();
    });
  }

  private getSyncSettings(): void {
    this.userService.getSyncSettings('STRAVA').subscribe((result) => {
      if (result.syncedAccountId) {
        this.activititiesSync = true; // TODO --> GET THIS TO ACTIVITIES PAGE TO ENABLE SYNC BUTTON
      }
    });
  }

  private getLogEntries(date: string) {
    this.allLogs = [];
    this.breakfastLogs = [];
    this.lunchLogs = [];
    this.snacksLogs = [];
    this.activitiesLogs = [];
    this.logService.getLogsForDate(date).subscribe(it => {
      this.allLogs = it;
      this.breakfastLogs = this.allLogs.filter((entry) => entry.meal === 'BREAKFAST');
      this.lunchLogs = this.allLogs.filter((entry) => entry.meal === 'LUNCH');
      this.dinnerLogs = this.allLogs.filter((entry) => entry.meal === 'DINNER');
      this.snacksLogs = this.allLogs.filter((entry) => entry.meal === 'SNACKS');
    });

    this.activityService.getActivitiesForDate(date).subscribe(it => {
      this.activitiesLogs = it;
    });
  }

  private setGoalCal() {
    if (this.intakeGoals) {
      this.goalCal =
        this.intakeGoals[0] * 4 +
        this.intakeGoals[1] * 9 +
        this.intakeGoals[2] * 4;
    }
  }

  private documentClick(event: any) {
    if (
      !event.target.classList.contains('autocomplete__option') &&
      !event.target.classList.contains('trash') &&
      !event.target.classList.contains('button--delete') &&
      !event.target.classList.contains('activity__name--sync') &&
      !event.target.classList.contains('activity__title--sync')
    ) {
      this.breakfastOpen = this.breakfastEref.logMealEref.nativeElement.contains(
        event.target
      );
      this.lunchOpen = this.lunchEref.logMealEref.nativeElement.contains(
        event.target
      );
      this.dinnerOpen = this.dinnerEref.logMealEref.nativeElement.contains(
        event.target
      );
      this.snacksOpen = this.snacksEref.logMealEref.nativeElement.contains(
        event.target
      );
      this.activitiesOpen = this.activitiesEref.logActivityEref.nativeElement.contains(
        event.target
      );
    }
  }
}

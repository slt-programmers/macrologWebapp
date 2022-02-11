import { Component, OnChanges, Input, Output, EventEmitter, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { format } from 'date-fns';
import { Activity } from '../../../../shared/model/activity';
import { ActivityService } from '../../../../shared/services/activity.service';

@Component({
  selector: 'ml-log-activity',
  templateUrl: './log-activity.component.html',
  styleUrls: ['./log-activity.component.scss']
})
export class LogActivityComponent implements OnChanges {
  @ViewChild('logActivity', { static: false }) private logActivityEref: ElementRef;

  @Input() logActivities: Activity[];
  @Input() date: Date;
  @Input() open: boolean;
  @Input() syncAvailable: boolean;

  @Output() dataChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() forced: EventEmitter<boolean> = new EventEmitter<boolean>();

  public editable: boolean;
  public newActivityName: string;
  public syncing = false;

  constructor(private activityService: ActivityService) {
    this.editable = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['date'] && this.editable) {
      this.saveAndClose();
    } else if (changes['open'] && !changes['open'].firstChange) {
      if (changes['open'].currentValue) {
        this.editable = true;
      } else {
        this.saveAndClose();
      }
    }
  }

  public showSync() {
    return this.syncAvailable && !this.syncing;
  }

  public forceSync() {
    this.syncing = true;
    this.forced.emit(true);
    this.syncing = false;
  }

  public close() {
    this.editable = false;
  }

  public addActivity() {
    if (this.newActivityName.length > 0) {
      this.logActivities.push({
        id: null,
        day: this.date,
        name: this.newActivityName,
        calories: 0,
      });
    }
    console.log(this.logActivities)
    this.newActivityName = null;
  }

  public deleteLogActivity(logActivity: Activity) {
    const index: number = this.logActivities.indexOf(logActivity);
    if (index !== -1) {
      this.logActivities.splice(index, 1);
    }

    this.activityService.deleteActivity(logActivity);
  }

  public saveAndClose() {
    console.log(this.logActivities);
    this.close();
    this.activityService.addActivities(format(this.date, 'yyyy-MM-dd'), this.logActivities).subscribe(it => {
      this.dataChanged.emit(true);
    });
  }
}

import { DatePipe } from '@angular/common';
import {
  Component,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList,
} from '@angular/core';

@Component({
  selector: 'ml-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent {
  @ViewChildren('dayRef') dayRefs: QueryList<any>;

  @Output() change$ = new EventEmitter<string>();

  public dateformat = 'dd-MM-yyyy';
  public today: Date;
  public selectedDate: Date;
  public daysInMonth: number;
  public daysInMonthArray = new Array();
  public weekdays = new Array();
  public placeholders = new Array();
  public isOpen = false;

  private pipe = new DatePipe('en-US');

  constructor() {
    this.today = new Date();
    this.selectedDate = this.today;
    this.setDaysInMonthArray();
    this.setWeekdays();
    this.getWeekdayPlaceholders();
  }

  public toggleOpen(event?: any) {
    if (event) {
      if (event.target && event.target.classList.value === 'overlay') {
        this.isOpen = !this.isOpen;
      }
    } else {
      this.isOpen = !this.isOpen;
    }
  }

  public nextDay() {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      this.selectedDate.getDate() + 1
    );
    this.setDaysInMonthArray();
    this.getWeekdayPlaceholders();
    this.change$.emit(this.pipe.transform(this.selectedDate, 'yyyy-MM-dd'));
  }

  public previousDay() {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      this.selectedDate.getDate() - 1
    );
    this.setDaysInMonthArray();
    this.getWeekdayPlaceholders();
    this.change$.emit(this.pipe.transform(this.selectedDate, 'yyyy-MM-dd'));
  }

  public nextMonth() {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth() + 1,
      this.selectedDate.getDate()
    );
    this.setDaysInMonthArray();
    this.getWeekdayPlaceholders();
  }

  public previousMonth() {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth() - 1,
      this.selectedDate.getDate()
    );
    this.setDaysInMonthArray();
    this.getWeekdayPlaceholders();
  }

  public selectDay(day: number) {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      day
    );
    this.isOpen = false;
    this.change$.emit(this.pipe.transform(this.selectedDate, 'yyyy-MM-dd'));
  }

  private setDaysInMonthArray() {
    this.daysInMonthArray = new Array();
    this.daysInMonth = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth() + 1,
      0
    ).getDate();
    for (let i = 1; i <= this.daysInMonth; i++) {
      this.daysInMonthArray.push(i);
    }
  }

  private setWeekdays() {
    this.weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }

  private getWeekdayPlaceholders() {
    this.placeholders = new Array();
    const firstOfMonth = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      1
    );
    const dayOfWeek = firstOfMonth.getDay();

    for (let i = 0; i < dayOfWeek; i++) {
      this.placeholders.push(i);
    }
  }
}

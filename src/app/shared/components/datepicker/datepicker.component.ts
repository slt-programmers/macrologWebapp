import { DatePipe, formatDate } from '@angular/common';
import { Component, output } from '@angular/core';

@Component({
  selector: 'ml-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
  imports: [DatePipe]
})
export class DatepickerComponent {
  readonly change$ = output<string>();

  readonly dateformat = 'dd-MM-yyyy';
  readonly weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  selectedDate = new Date();;
  daysInMonth = 30;
  daysInMonthArray: number[] = [];
  placeholders: number[] = [];
  isOpen = false;

  constructor() {
    this.setDaysInMonthArray();
    this.getWeekdayPlaceholders();
  }

  toggleOpen(event?: any): void {
    if (event) {
      if (event.target && event.target.classList.value === 'overlay') {
        this.isOpen = !this.isOpen;
      }
    } else {
      this.isOpen = !this.isOpen;
    }
  }

  nextDay() {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      this.selectedDate.getDate() + 1
    );
    this.setDaysInMonthArray();
    this.getWeekdayPlaceholders();
    this.change$.emit(formatDate(this.selectedDate, 'yyyy-MM-dd', 'en-US'));
  }

  previousDay() {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      this.selectedDate.getDate() - 1
    );
    this.setDaysInMonthArray();
    this.getWeekdayPlaceholders();
    this.change$.emit(formatDate(this.selectedDate, 'yyyy-MM-dd', 'en-US'));
  }

  nextMonth() {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth() + 1,
      this.selectedDate.getDate()
    );
    this.setDaysInMonthArray();
    this.getWeekdayPlaceholders();
  }

  previousMonth() {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth() - 1,
      this.selectedDate.getDate()
    );
    this.setDaysInMonthArray();
    this.getWeekdayPlaceholders();
  }

  selectDay(day: number) {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      day
    );
    this.isOpen = false;
    this.change$.emit(formatDate(this.selectedDate, 'yyyy-MM-dd', 'en-US'));
  }

  private setDaysInMonthArray() {
    this.daysInMonthArray = [];
    this.daysInMonth = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth() + 1,
      0
    ).getDate();
    for (let i = 1; i <= this.daysInMonth; i++) {
      this.daysInMonthArray.push(i);
    }
  }

  private getWeekdayPlaceholders() {
    this.placeholders = [];
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

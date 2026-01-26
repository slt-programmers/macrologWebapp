import { Component, input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { DatepickerComponent } from '../datepicker/datepicker.component';

@Component({
  selector: 'ml-period-picker',
  imports: [DatepickerComponent, FontAwesomeModule],
  templateUrl: './period-picker.html'
})
export class PeriodPicker {
  readonly dateFrom = input.required<Date>();
  readonly dateTo = input.required<Date>();

  readonly dateFromChange = output<Date>();
  readonly dateToChange = output<Date>();

  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  initialDateFrom = this.getInitialDateFrom();

  changeFromDate(newFromDate: string): void {
    this.dateFromChange.emit(new Date(newFromDate));
  }

  changeToDate(newToDate: string): void {
    this.dateToChange.emit(new Date(newToDate));
  }

  getInitialDateFrom(): Date {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() + 1);
    return lastMonth;
  }
}

import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ml-period-picker',
  imports: [DatePipe, FontAwesomeModule],
  templateUrl: './period-picker.html'
})
export class PeriodPicker {
  readonly dateFrom = input.required<Date>();
  readonly dateTo = input.required<Date>();

  readonly next = output<void>();
  readonly previous = output<void>();

  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  monthForward(): void {
    this.next.emit();
  }

  monthBack(): void {
    this.previous.emit();
  }
}

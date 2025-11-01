import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectTotalsForDate } from 'src/app/shared/store/selectors/entries.selectors';
import { Observable } from 'rxjs';
import { Macros } from 'src/app/shared/model/macros';

@Component({
    selector: 'ml-diary',
    templateUrl: './diary.component.html',
    standalone: false
})
export class DiaryComponent implements OnInit {

  public date: string;
  public totals$: Observable<Macros>;
  public intakeGoals: any[];
  public goalCal: number;
  public circleRadius = 60;
  public strokeWidth = 8;
  
  private pipe: DatePipe;

  constructor(private readonly userService: UserService,
    private readonly store: Store,
    private readonly window: Window) {
      this.pipe = new DatePipe('en-US');
      this.date = this.pipe.transform(new Date(), 'yyyy-MM-dd');
      this.totals$ = this.store.select(selectTotalsForDate(this.date));
  }

  ngOnInit() {
    this.getUserGoals(this.date);
    if (this.window.innerWidth < 480) {
      this.circleRadius = 40;
      this.strokeWidth = 5;
    }
  }

  public changeDate(event: any) {
    this.date = event;
    this.getUserGoals(this.date);
    this.totals$ = this.store.select(selectTotalsForDate(this.date));
  }

  private getUserGoals(date: string): void {
    this.intakeGoals = [];
    this.userService.getUserGoalStats(date).subscribe(it => {
      this.intakeGoals = it
      this.setGoalCal();
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

}

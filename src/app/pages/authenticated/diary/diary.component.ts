import { Component, OnInit, inject } from "@angular/core";
import { UserService } from "../../../shared/services/user.service";
import { DatePipe, AsyncPipe, DecimalPipe } from "@angular/common";
import { Store } from "@ngrx/store";
import { selectTotalsForDate } from "src/app/shared/store/selectors/entries.selectors";
import { Observable } from "rxjs";
import { Macros } from "src/app/shared/model/macros";
import { StackDonutComponent } from "../../../shared/components/stackdonut/stackdonut.component";
import { DatepickerComponent } from "../../../shared/components/datepicker/datepicker.component";
import { DiaryPageComponent } from "./diary-page/diary-page.component";

@Component({
	selector: "ml-diary",
	templateUrl: "./diary.component.html",
	imports: [
		StackDonutComponent,
		DatepickerComponent,
		DiaryPageComponent,
		AsyncPipe,
		DecimalPipe,
	],
	styles: `:host { 
    display: flex;
    flex-direction: column;
    gap: 16px;
  }`,
})
export class DiaryComponent implements OnInit {
	private readonly userService = inject(UserService);
	private readonly store = inject(Store);
	private readonly window = inject(Window);

	private pipe = new DatePipe("en-US");

	public date = this.pipe.transform(new Date(), "yyyy-MM-dd")!;
	public totals$: Observable<Macros> = this.store.select(
		selectTotalsForDate(this.date)
	);
	public intakeGoals: any[] = [];
	public goalCal = 0;

	ngOnInit() {
		this.getUserGoals(this.date);
	}

	public changeDate(event: any) {
		this.date = event;
		this.getUserGoals(this.date);
		this.totals$ = this.store.select(selectTotalsForDate(this.date));
	}

	private getUserGoals(date: string): void {
		this.intakeGoals = [];
		this.userService.getUserGoalStats(date).subscribe((it) => {
			this.intakeGoals = it;
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

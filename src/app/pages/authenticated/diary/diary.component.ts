import { DecimalPipe, formatDate } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { EntryStore } from "src/app/shared/store/entry.store";
import { DatepickerComponent } from "../../../shared/components/datepicker/datepicker.component";
import { StackDonutComponent } from "../../../shared/components/stackdonut/stackdonut.component";
import { UserService } from "../../../shared/services/user.service";
import { DiaryPageComponent } from "./diary-page/diary-page.component";
import { DateStore } from "src/app/shared/store/date.store";

@Component({
	selector: "ml-diary",
	templateUrl: "./diary.component.html",
	imports: [
		StackDonutComponent,
		DatepickerComponent,
		DiaryPageComponent,
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
	private readonly entryStore = inject(EntryStore);
  private readonly dateStore = inject(DateStore);

	date = formatDate(new Date(), "yyyy-MM-dd", "en-US")!;
	totals = this.entryStore.totalsForDay;

	intakeGoals: any[] = [];
	goalCal = 0;

	ngOnInit() {
		this.getUserGoals(this.date);
	}

	changeDate(event: any) {
		this.date = event;
		this.getUserGoals(this.date);
		this.dateStore.setDisplayDate(this.date);
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

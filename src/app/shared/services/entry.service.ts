import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Entry } from "../model/entry";
import { MacrosPerDay } from "../model/macrosPerDay";
import { Meal } from "../model/meal";

@Injectable()
export class EntryService {
	private readonly http = inject(HttpClient);
	private readonly backendUrl = "//" + environment.backend + "/logs";

	getEntriesPerDay(date: string): Observable<Entry[]> {
		return this.http.get<Entry[]>(this.backendUrl + "/day/" + date);
	}

	getMacrosPerDay(
		dateFrom: string,
		dateTo: string
	): Observable<MacrosPerDay[]> {
		return this.http.get<MacrosPerDay[]>(this.backendUrl + "/macros", {
			params: { from: dateFrom, to: dateTo },
		});
	}

	postEntriesPerDayPerMeal(entries: Entry[], date: string, meal: Meal) {
		return this.http.post<Entry[]>(
			this.backendUrl + "/day/" + date + "/" + meal,
			entries
		);
	}
}

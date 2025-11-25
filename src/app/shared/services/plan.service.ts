import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { catchError, Observable, of } from "rxjs";
import { environment } from "src/environments/environment";
import { Mealplan } from "../model/mealplan";

@Injectable({
	providedIn: "root",
})
export class PlanService {
	private readonly http = inject(HttpClient);
	private readonly backendUrl = "//" + environment.backend + "/plans";

	// TODO remove
	newId = signal(0);

	createPlan(): Observable<Mealplan> {
		return this.http
			.post<Mealplan>(this.backendUrl, {
				title: "New mealplan",
				mealtimes: [],
			})
			.pipe(
				catchError(() => {
					this.newId.set(this.newId() + 1);
					return of({
						id: this.newId(),
						title: "New mealplan",
						mealtimes: [],
					});
				})
			);
	}

	savePlan(mealplan: Mealplan): Observable<Mealplan> {
		return this.http.put<Mealplan>(this.backendUrl, mealplan).pipe(
			catchError(() => {
				return of(mealplan);
			})
		);
	}

	deletePlan(id: number): Observable<void> {
		return this.http.delete<void>(this.backendUrl + "/" + id).pipe(
			catchError(() => {
				return of(undefined);
			})
		);
	}
}

import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Mealplan } from "../model/mealplan";
import { MealplanRequest } from "../model/requests/mealplan-request";

@Injectable({
  providedIn: "root",
})
export class PlanService {
  private readonly http = inject(HttpClient);
  private readonly backendUrl = "//" + environment.backend + "/mealplans";

  getPlans(): Observable<Mealplan[]> {
    return this.http.get<Mealplan[]>(this.backendUrl);
  }

  createPlan(): Observable<Mealplan> {
    return this.http.post<Mealplan>(this.backendUrl, { title: "New mealplan", mealtimes: [] })
  }

  savePlan(mealplan: MealplanRequest | Mealplan): Observable<Mealplan> {
    return this.http.put<Mealplan>(this.backendUrl, mealplan);
  }

  deletePlan(id: number): Observable<void> {
    return this.http.delete<void>(this.backendUrl + "/" + id);
  }
}

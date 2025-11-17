import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Food } from "../model/food";

@Injectable()
export class FoodService {
	private readonly http = inject(HttpClient);
	private readonly backendUrl = "//" + environment.backend + "/food";

	getFood(): Observable<Food[]> {
		return this.http.get<Food[]>(this.backendUrl);
	}

	postFood(food: Food): Observable<void> {
		return this.http.post<void>(this.backendUrl, food);
	}
}

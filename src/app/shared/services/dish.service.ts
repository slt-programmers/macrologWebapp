import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Dish } from "../model/dish";

@Injectable()
export class DishService {
	private readonly http = inject(HttpClient);
	private readonly backendUrl = "//" + environment.backend + "/dishes";

  getDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(this.backendUrl);
  }

  postDish(dish: Dish): Observable<void> {
    return this.http.post<void>(this.backendUrl, dish);
  }

  deleteDish(id: number) {
    return this.http.delete<void>(this.backendUrl + '/' + id);
  }
}

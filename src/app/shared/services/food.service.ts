import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Food } from '../model/food';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class FoodService {
  macrologBackendUrl = '//' + environment.backend + '/food';

  constructor(private http: HttpClient) { }

  public addFood(addFoodRequest: Food): Observable<Food> {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };

    const options = { headers: headers };
    return this.http.post<Food>(this.macrologBackendUrl + '/', addFoodRequest, options).pipe(
      catchError(error => {
        return of<any>();
      }));
  }

  public getAllFood(): Observable<Food[]> {
    return this.http.get<Food[]>(this.macrologBackendUrl).pipe(
      catchError(error => {
        return of<any>();
      }));
  }
}

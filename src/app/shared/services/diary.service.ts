import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StoreLogRequest } from '../model/storeLogRequest';
import { Entry } from '../model/entry';
import { environment } from '../../../environments/environment';
import { MacrosPerDay } from '../model/macrosPerDay';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class DiaryService {
  macrologBackendUrl = '//' + environment.backend + '/logs';

  constructor(private http: HttpClient) { }

  public getMacrosPerDay(dateFrom: string, dateTo: string): Observable<MacrosPerDay[]> {
    return this.http.get<MacrosPerDay[]>(this.macrologBackendUrl + '/macros',
      { params: { from: dateFrom, to: dateTo } })
      .pipe(catchError(error => { return of<any>() }));
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MacrosPerDay } from '../model/macrosPerDay';

@Injectable()
export class DiaryService {
  private http = inject(HttpClient);

  macrologBackendUrl = '//' + environment.backend + '/logs';

  public getMacrosPerDay(dateFrom: string, dateTo: string): Observable<MacrosPerDay[]> {
    return this.http.get<MacrosPerDay[]>(this.macrologBackendUrl + '/macros',
      { params: { from: dateFrom, to: dateTo } })
      .pipe(catchError(() => { return of<any>() }));
  }

}

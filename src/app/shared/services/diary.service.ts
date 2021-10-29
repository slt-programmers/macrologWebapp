import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StoreLogRequest } from '../model/storeLogRequest';
import { LogEntry } from '../model/logEntry';
import { ToastService } from './toast.service';
import { environment } from '../../../environments/environment';
import { MacrosPerDay } from '../model/macrosPerDay';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class DiaryService {
  macrologBackendUrl = '//' + environment.backend + '/logs';

  constructor(private http: HttpClient) { }

  public getLogsForDay(date: string): Observable<LogEntry[]> {
    return this.http.get<LogEntry[]>(this.macrologBackendUrl + '/day/' + date).pipe(
      catchError(error => {
        return of<any>()
      }));
  }

  public getMacrosPerDay(dateFrom: string, dateTo: string): Observable<MacrosPerDay[]> {
    return this.http.get<MacrosPerDay[]>(this.macrologBackendUrl + '/macros', {
      params: { from: dateFrom, to: dateTo },
      responseType: 'json',
    }).pipe(catchError(error => {
      return of<any>()
    }));
  }

  public addEntries(storeLogEntryRequest: StoreLogRequest[]): Observable<LogEntry[]> {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };

    const options = { headers: headers };
    return this.http.post<StoreLogRequest[]>(this.macrologBackendUrl + '/', storeLogEntryRequest, options)
      .pipe(catchError(error => { return of<any>() }));
  }

  public deleteEntry(logEntry: LogEntry): Observable<number> {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };
    const options = { headers: headers };
    return this.http.delete<number>(this.macrologBackendUrl + '/' + logEntry.id, options).pipe(
      catchError(error => {
        return of<any>()
      }));
  }
}

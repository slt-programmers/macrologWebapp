import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HealthcheckService {
  private http = inject(HttpClient);

  private macrologBackendUrl = '//' + environment.backend + '/healthcheck';

  public checkState(): Observable<boolean> {
    return this.http.get<boolean>(this.macrologBackendUrl);
  }
}

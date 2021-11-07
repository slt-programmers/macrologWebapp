import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { WebhookStatus } from '../model/webhookStatus';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class WebhookService {
  private macrologBackendUrl = '//' + environment.backend + '/webhooks';

  constructor(private readonly http: HttpClient) { }

  public getWebhookStatus(connectedApp: string) {
    return this.http.get<WebhookStatus>(this.macrologBackendUrl + '/' + connectedApp).pipe(
      catchError(error => {
        console.log(error);
        return of()
      }));
  }

  public startWebhook(connectedApp: string) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };
    const options = { headers: headers };
    return this.http.post(this.macrologBackendUrl + '/' + connectedApp, {}, options).pipe(
      catchError(error => {
        console.log(error);
        return of();
      }));
  }

  public endWebhook(connectedApp: string, hookId: number) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };
    const options = { headers: headers };
    return this.http.delete(this.macrologBackendUrl + '/' + connectedApp + '/' + hookId, options).pipe(
      catchError(error => {
        console.log(error);
        return of();
      })
    )
  }
}

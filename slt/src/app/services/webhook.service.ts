import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { WebhookStatus } from '../model/webhookStatus';

@Injectable()
export class WebhookService {
  private macrologBackendUrl = '//' + environment.backend + '/webhooks';

  constructor(private http: HttpClient) {}

  public getWebhookStatus(connectedApp: string) {
    return this.http.get<WebhookStatus>(
      this.macrologBackendUrl + '/' + connectedApp,
      { responseType: 'json' }
    );
  }

  public startWebhook(connectedApp: string) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };

    const postData = {};
    const options = { headers: headers };
    return this.http.post(
      this.macrologBackendUrl + '/' + connectedApp,
      postData,
      options
    );
  }

  public endWebhook(connectedApp: string, subscriptionId: number) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };

    const options = { headers: headers };
    return this.http.delete(
      this.macrologBackendUrl + '/' + connectedApp + '/' + subscriptionId,
      options
    );
  }
}

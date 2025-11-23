import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { WebhookStatus } from '../model/webhookStatus';

@Injectable()
export class WebhookService {
  private readonly http = inject(HttpClient);

  private macrologBackendUrl = '//' + environment.backend + '/webhooks';

  getWebhookStatus(connectedApp: string) {
    return this.http.get<WebhookStatus>(this.macrologBackendUrl + '/' + connectedApp)
  }

  startWebhook(connectedApp: string) {
    return this.http.post(this.macrologBackendUrl + '/' + connectedApp, {})
  }

  endWebhook(connectedApp: string, hookId: number) {
    return this.http.delete(this.macrologBackendUrl + '/' + connectedApp + '/' + hookId)
  }
}

import { Component, OnInit } from '@angular/core';
import { WebhookStatus } from 'src/app/model/webhookStatus';
import { WebhookService } from 'src/app/services/webhook.service';

@Component({
  selector: 'app-webhooks',
  templateUrl: './webhooks.component.html',
  styleUrls: ['./webhooks.component.scss'],
})
export class WebhooksComponent implements OnInit {
  constructor(private webhookService: WebhookService) {}

  public allWebhooks = new Array();

  ngOnInit() {
    this.retrieveStatus('STRAVA');
  }

  disableWebhook(connectedApp: string) {
    const hook = this.getStatus(connectedApp);
    this.webhookService.endWebhook(connectedApp, hook.id).subscribe(
      () => {
        this.retrieveStatus(connectedApp);
      },
      (err) => {
        // TODO handle error
      }
    );
  }

  enableWebhook(connectedApp: string) {
    this.webhookService.startWebhook(connectedApp).subscribe(
      () => {
        this.retrieveStatus(connectedApp);
      },
      (err) => {
        // TODO handle error
      }
    );
  }

  getStatus(connectedApp: string): WebhookStatus {
    for (const hook of this.allWebhooks) {
      if (hook.connectedApp === connectedApp) {
        return hook.webhook;
      }
    }
    return undefined;
  }

  private retrieveStatus(connectedApp: string) {
    // delete old one. Only strava now, so delete all :p
    this.allWebhooks = new Array();
    this.webhookService.getWebhookStatus(connectedApp).subscribe(
      (res) => {
        this.allWebhooks.push({ connectedApp: connectedApp, webhook: res });
      },
      (err) => {
        // TODO handle error
      }
    );
  }
}

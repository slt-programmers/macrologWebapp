import { Component, OnInit } from '@angular/core';
import { WebhookStatus } from 'src/app/shared/model/webhookStatus';
import { WebhookService } from 'src/app/shared/services/webhook.service';

@Component({
    selector: 'ml-webhooks',
    templateUrl: './webhooks.component.html',
    standalone: false
})
export class WebhooksComponent implements OnInit {
  constructor(private readonly webhookService: WebhookService) { }

  public allWebhooks: any[] = [];

  ngOnInit() {
    this.retrieveStatus('STRAVA');
  }

  disableWebhook(connectedApp: string) {
    const hook = this.getStatus(connectedApp);
    if (hook.id) {
      this.webhookService.endWebhook(connectedApp, hook.id).subscribe(() => {
        this.retrieveStatus(connectedApp);
      });
    }
  }

  enableWebhook(connectedApp: string) {
    this.webhookService.startWebhook(connectedApp).subscribe(() => {
      this.retrieveStatus(connectedApp);
    });
  }

  getStatus(connectedApp: string): WebhookStatus {
    for (const hook of this.allWebhooks) {
      if (hook.connectedApp === connectedApp) {
        return hook.webhook;
      }
    }
    return {} as WebhookStatus;
  }

  private retrieveStatus(connectedApp: string) {
    // delete old one. Only strava now, so delete all :p
    this.allWebhooks = new Array();
    this.webhookService.getWebhookStatus(connectedApp).subscribe(it => {
      this.allWebhooks.push({ connectedApp: connectedApp, webhook: it });
    });
  }
}

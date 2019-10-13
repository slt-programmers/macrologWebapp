import { Component, OnInit } from '@angular/core';
import { WebhookService } from '@app/services/webhook.service';
import { WebhookStatus } from '@app/model/webhookStatus';
import { ToastService } from '@app/services/toast.service';

@Component({
  selector: 'app-webhooks',
  templateUrl: './webhooks.component.html',
  styleUrls: ['./webhooks.component.scss']
})
export class WebhooksComponent implements OnInit {


  constructor(private webhookService: WebhookService,
  private toastService: ToastService) { }

  public allWebhooks = new Array();

  ngOnInit() {
    this.retrieveStatus('STRAVA');
  }

  disableWebhook(connectedApp:string) {
    let hook = this.getStatus(connectedApp);
    this.webhookService.endWebhook(connectedApp,hook.id).subscribe(
      res => {
       this.retrieveStatus(connectedApp);
      },
      err => {
        console.log(err);
      }
		 );
  }

  enableWebhook(connectedApp:string) {
    let hook = this.getStatus(connectedApp);
    this.webhookService.startWebhook(connectedApp).subscribe(
      res => {
         this.retrieveStatus(connectedApp);
      },
      err => {
        console.log(err);
      }
		 );
  }

  getStatus(connectedApp:string):WebhookStatus {
     	for (const hook of this.allWebhooks) {
		  	if (hook.connectedApp === connectedApp) {
			  	return hook.webhook;
			  }
      }
      return undefined;
  }

  private retrieveStatus(connectedApp:string) {
    // delete old one. Only strava now, so delete all :p
    this.allWebhooks = new Array();

    this.webhookService.getWebhookStatus(connectedApp).subscribe(
      res => {
        this.allWebhooks.push({'connectedApp' : connectedApp , 'webhook' : res });
      },
      err => {
        console.log(err);
      }
    );
  }

}

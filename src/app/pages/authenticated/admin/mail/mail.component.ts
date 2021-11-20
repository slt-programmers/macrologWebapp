import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleService } from 'src/app/shared/services/google.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'ml-mail',
  templateUrl: './mail.component.html'
})
export class MailComponent implements OnInit {
  public googleConnectUrl: string = '';
  public isConnected = false;
  public syncError: string = '';
  public emailAddress: string | null = null;
  public mailSend = false;

  private clientId: string = '';
  private code: string | null = null;
  private scope: string | null = null;

  constructor(private readonly googleService: GoogleService, private readonly route: ActivatedRoute) { }

  ngOnInit() {
    this.retrieveStatus();
  }

  sendTestMail() {
    this.mailSend = false;
    if (this.emailAddress) {
      this.googleService.sendTestMail(this.emailAddress).subscribe(() => {
        this.mailSend = true;
        this.emailAddress = null;
      });
    }
  }

  private retrieveStatus() {
    this.googleService.getStatus().subscribe(it => {
        this.isConnected = it.connected;
        this.clientId = it.syncedApplicationId;
        this.setGoogleUrl();
        if (!this.isConnected) {
          this.checkRegistrationResponse();
        }
      }
    );
  }

  private checkRegistrationResponse() {
    if (!this.code) {
      // only if not done before
      this.route.queryParamMap.subscribe((queryParams) => {
        this.code = queryParams.get('code');
        this.scope = queryParams.get('scope');
        if (this.code) {
          if (this.scope !== 'https://www.googleapis.com/auth/gmail.send') {
            this.syncError =
              'Please give access to send mail in order to allow Macrolog send mails to new users.';
          } else {
            this.storeConnection();
          }
        }
      });
    }
  }

  private storeConnection() {
    this.googleService.storeMailSyncSettings(this.code).subscribe(() => {
      this.isConnected = true;
    });
  }

  private setGoogleUrl() {
    const googleUrl =
      'https://accounts.google.com/o/oauth2/auth?response_type=code&approval_prompt=force&scope=https://www.googleapis.com/auth/gmail.send&state=GMAILCONNECT&access_type=offline';
    const redirectUrl = environment.origin + '/dashboard/admin/mail';
    this.googleConnectUrl =
      googleUrl +
      '&client_id=' +
      this.clientId +
      '&redirect_uri=' +
      redirectUrl;
  }
}

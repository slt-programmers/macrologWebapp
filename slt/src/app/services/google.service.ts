import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ConnectivityRequest } from '../model/connectivityRequest';
import { ConnectivityStatus } from '../model/connectivityStatus';
import { MailRequest } from '../model/mailRequest';

@Injectable()
export class GoogleService {
  private macrologBackendUrl = '//' + environment.backend + '/admin/mail';

  constructor(private http: HttpClient) {}

  public getStatus() {
    return this.http.get<ConnectivityStatus>(
      this.macrologBackendUrl + '/status',
      { responseType: 'json' }
    );
  }

  public storeMailSyncSettings(code: string) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };

    const connectivityRequest = new ConnectivityRequest(code);
    const options = { headers: headers };
    return this.http.post<ConnectivityRequest>(
      this.macrologBackendUrl,
      connectivityRequest,
      options
    );
  }
  public sendTestMail(mailAddress: string) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };
    const mailRequest = new MailRequest(mailAddress);
    const options = { headers: headers };
    return this.http.post(
      this.macrologBackendUrl + '/testmail',
      mailRequest,
      options
    );
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../../../shared/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'ml-connectivity',
  templateUrl: './connectivity.component.html',
  styleUrls: ['./connectivity.component.css'],
  imports: []
})
export class ConnectivityComponent implements OnInit {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);

  public syncError = ''
  public stravaConnectUrl = ''
  public connection: any;

  private code?: string | null;
  private scope?: string | null;
  private clientId = 0;

  ngOnInit() {
    this.getSyncSettings();
  }

  public isConnected() {
    return this.connection && this.connection.syncedAccountId;
  }

  public disconnect() {
    this.userService.disconnectSyncSettings('STRAVA').subscribe(() => {
      this.getSyncSettings();
    });
  }

  private getSyncSettings() {
    this.userService.getSyncSettings('STRAVA').subscribe(
      (result) => {
        this.syncError = '';
        this.connection = result;
        this.clientId = result.syncedApplicationId;
        this.setStravaUrl();
        if (!this.isConnected()) {
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
          if (this.scope !== 'read,activity:read_all') {
            this.syncError =
              'Please give access to view your activitities in order to allow Macrolog to read your Strava activities';
          } else {
            this.storeConnection();
          }
        }
      });
    }
  }

  private storeConnection() {
    if (this.code) {
      this.userService
        .storeSyncSettings('STRAVA', this.code)
        .subscribe((result) => {
          this.connection = result;
        });
    }
  }

  private setStravaUrl() {
    const stravaUrl = environment.stravaUrl;
    const redirectUrl = environment.origin + '/dashboard/user/connectivity';
    this.stravaConnectUrl =
      stravaUrl +
      '&client_id=' +
      this.clientId +
      '&redirect_uri=' +
      redirectUrl;
  }
}

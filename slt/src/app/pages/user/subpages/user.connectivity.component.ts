import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
   selector: 'user-connectivity',
   templateUrl: './user.connectivity.component.html',
   styleUrls: ['./user.connectivity.component.scss']
})
export class UserConnectivityComponent {

   public syncError: string;
   public stravaConnectUrl: string;

   private code: string;
   private scope: string;
   private connection: any;
   private clientId: number;

   constructor(
      private userService: UserService,
      private route: ActivatedRoute) {
      this.syncSettings();
   }

   private setStravaUrl() {
      const stravaUrl = 'http://www.strava.com/oauth/authorize?approval_prompt=force&scope=activity:read_all&response_type=code&state=STRAVACONNECT';
      const redirectUrl = window.location.origin + '/user/connectivity';
      this.stravaConnectUrl = stravaUrl + '&client_id=' + this.clientId + '&redirect_uri=' + redirectUrl;
   }
   public isConnected() {
      return this.connection && this.connection.syncedAccountId;
   }

   public disconnect() {
      this.userService.disConnectSyncSettings('STRAVA').subscribe(result => {
         this.syncSettings();
      });
   }

   public doRegisterBackend() {
      return this.code;
   }

   private syncSettings() {
      this.userService.getSyncSettings('STRAVA').subscribe(
         result => {
            this.syncError = null;
            this.connection = result;
            this.clientId = result.syncedApplicationId;
            this.setStravaUrl();
            if (!this.isConnected()) {
               this.checkRegistrationResponse();
            }
         });
   }

   private checkRegistrationResponse() {
      if (!this.code) { // only if not done before
         this.route.queryParamMap.subscribe(queryParams => {
            this.code = queryParams.get('code');
            this.scope = queryParams.get('scope');

            if (this.code) {
               if (this.scope !== 'read,activity:read_all') {
                  this.syncError = 'Please give access to view your activitities in order to allow Macrolog to read your Strava activities';
               } else {
                  this.storeConnection();
               }
            }
         });
      }
   }

   public storeConnection() {
      this.userService.storeSyncSettings('STRAVA', this.code).subscribe(result => {
         this.connection = result;
      });
   }
}

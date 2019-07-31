import{Component}from'@angular/core';
import {UserService }from '../../../services/user.service';
import {ToastService}from '../../../services/toast.service';
import {ActivatedRoute}from "@angular/router";
import {Location} from '@angular/common'

@Component({
  selector: 'user-connectivity',
  templateUrl: './user.connectivity.component.html'
})
export class UserConnectivityComponent {

  public state;
  public code;
  public scope;
  public error;
  public connected;
  public clientId;
  public syncError;
  public stravaConnectUrl;

  constructor(
    private loc: Location,
    private userService: UserService,
    private route: ActivatedRoute,
    private toastService: ToastService) {
    this.init();
  }

  private setStravaUrl(){
    let stravaUrl= "http://www.strava.com/oauth/authorize?approval_prompt=force&scope=activity:read_all&response_type=code&state=STRAVACONNECT";
    let redirectUrl = window.location.origin + '/user/connectivity';
    this.stravaConnectUrl= stravaUrl + "&client_id="+this.clientId + "&redirect_uri=" + redirectUrl;
  }
  public isConnected(){
     return this.connected && this.connected.syncedAccountId;
  }
  public storeConnection(){
 	   this.userService.storeSyncSettings('STRAVA',this.code).subscribe(result =>
         { console.log(result);
           this.connected=result;
         });
  }

  public disconnect(){
 	   this.userService.disConnectSyncSettings('STRAVA').subscribe(result =>
         { console.log(result);
           console.log('disConnect');
           this.syncSettings();
         });
  }

  public doRegisterBackend(){
     return this.code;
  }

  private syncSettings(){
     this.userService.getSyncSettings('STRAVA').subscribe(
			result => {
         this.syncError = null;
         this.connected = result;
         this.clientId = result.syncedApplicationId;
         this.setStravaUrl();
         if (!this.isConnected()){
             this.checkRegistrationResponse();
         }
		  });
  }

  private checkRegistrationResponse(){
     if (!this.code) { // only if not done before
          this.route.queryParamMap.subscribe(queryParams => {
          console.log('response' + queryParams.get("code"));

          this.code = queryParams.get("code");
          this.state = queryParams.get("state");
          this.scope = queryParams.get("scope");
          this.error = queryParams.get("error");

          console.log(queryParams);
          if (this.code) {
              console.log('register backend');
							if (this.scope != 'read,activity:read_all') {
								 this.syncError = 'Please give access to view your activitities in order to allow Macrolog to read your Strava activities'
							} else {
                 this.storeConnection();
              }
           }

       })
     }
  }

  public init() {
     this.syncSettings();
  }

}

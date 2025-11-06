import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { GoogleService } from 'src/app/shared/services/google.service';
import { MailComponent } from './mail.component';

describe('MailComponent', () => {
  let component: MailComponent;
  let fixture: ComponentFixture<MailComponent>;
  let googleService: GoogleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MailComponent],
      providers: [
        MockProvider(GoogleService),
        MockProvider(ActivatedRoute),
        provideRouter([])
      ]
    }).compileComponents();

    googleService = TestBed.inject(GoogleService);
  });

  it('should create', () => {
    fixture = TestBed.createComponent(MailComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should init component', () => {
    spyOn(googleService, 'getStatus').and.returnValue(of({ syncedApplicationId: 'test', connected: true }));
    fixture = TestBed.createComponent(MailComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    expect(googleService.getStatus).toHaveBeenCalled();
    expect(component.isConnected).toBeTrue();
    expect(component.googleConnectUrl).toEqual(
      'https://accounts.google.com/o/oauth2/auth?response_type=code&approval_prompt=force&scope=https://www.googleapis.com/auth/gmail.send&state=GMAILCONNECT&access_type=offline&client_id=test&redirect_uri=http://localhost:4200/dashboard/admin/mail');
  });

  // it('should init component and check registration response', () => {
  //   spyOn(googleService, 'getStatus').and.returnValue(of({ syncedApplicationId: 'test', connected: false }));
  //   // spyOnProperty(route, 'queryParamMap').and.returnValue(of({
  //   //   get: function (prop: string) {
  //   //     if (prop === 'code') { return 'code' } else { return 'scope' }
  //   //   }
  //   // }));
  //   fixture = TestBed.createComponent(MailComponent);
  //   component = fixture.componentInstance;
  //   component.ngOnInit();
  //   expect(googleService.getStatus).toHaveBeenCalled();
  //   expect(component.isConnected).toBeFalse();
  //   component.ngOnInit();
  // });

  // it('should init component, check registration response but not store connection', () => {
  //   spyOn(googleService, 'getStatus').and.returnValue(of({ syncedApplicationId: 'test', connected: false }));
  //   // spyOnProperty(route, 'queryParamMap').and.returnValue(of({
  //   //   get: function (prop: string) {
  //   //     if (prop === 'code') { return undefined } else { return 'scope' }
  //   //   }
  //   // }));
  //   spyOn(googleService, 'storeMailSyncSettings');
  //   fixture = TestBed.createComponent(MailComponent);
  //   component = fixture.componentInstance;
  //   component.ngOnInit();
  //   expect(googleService.getStatus).toHaveBeenCalled();
  //   expect(component.isConnected).toBeFalse();
  //   expect(googleService.storeMailSyncSettings).not.toHaveBeenCalled();
  // });

  // it('should init component and store connection', () => {
  //   spyOn(googleService, 'getStatus').and.returnValue(of({ syncedApplicationId: 'test', connected: false }));
  //   spyOn(googleService, 'storeMailSyncSettings').and.returnValue(of({} as any));
  //   // spyOnProperty(route, 'queryParamMap').and.returnValue(of({
  //   //   get: function (prop: string) {
  //   //     if (prop === 'code') { return 'code' } else { return 'https://www.googleapis.com/auth/gmail.send' }
  //   //   }
  //   // }));
  //   fixture = TestBed.createComponent(MailComponent);
  //   component = fixture.componentInstance;
  //   component.ngOnInit();
  //   expect(googleService.getStatus).toHaveBeenCalled();
  //   expect(googleService.storeMailSyncSettings).toHaveBeenCalledWith('code');
  //   expect(component.isConnected).toBeTrue();
  // });

  it('should send testmail', () => {
    spyOn(googleService, 'sendTestMail').and.returnValue(of({}));
    fixture = TestBed.createComponent(MailComponent);
    component = fixture.componentInstance;
    component.sendTestMail();
    expect(googleService.sendTestMail).not.toHaveBeenCalled();
    component.emailAddress = 'test@test.com';
    component.sendTestMail();
    expect(googleService.sendTestMail).toHaveBeenCalled();
    expect(component.mailSend).toBeTrue();
    expect(component.emailAddress).toBeNull();
  });

});
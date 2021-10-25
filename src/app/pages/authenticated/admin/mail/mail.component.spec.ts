import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { WebhookService } from 'src/app/shared/services/webhook.service';
import { of, throwError } from 'rxjs';
import { MailComponent } from './mail.component';
import { GoogleService } from 'src/app/shared/services/google.service';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { not } from '@angular/compiler/src/output/output_ast';

describe('MailComponent', () => {
  let component: MailComponent;
  let fixture: ComponentFixture<MailComponent>;
  let googleService: GoogleService;
  let route: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [MailComponent],
      providers: [
        MockProvider(GoogleService),
        MockProvider(ActivatedRoute)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MailComponent);
    component = fixture.componentInstance;
    googleService = TestBed.inject(GoogleService);
    route = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init component', () => {
    spyOn(googleService, 'getStatus').and.returnValue(of({ syncedApplicationId: 'test', connected: true }));
    component.ngOnInit();
    expect(googleService.getStatus).toHaveBeenCalled();
    expect(component.isConnected).toBeTrue();
    expect(component.googleConnectUrl).toEqual(
      'https://accounts.google.com/o/oauth2/auth?response_type=code&approval_prompt=force&scope=https://www.googleapis.com/auth/gmail.send&state=GMAILCONNECT&access_type=offline&client_id=test&redirect_uri=https://localhost:4200/admin/mail');
  });

  it('should handle error on init component', () => {
    spyOn(googleService, 'getStatus').and.returnValue(throwError({ status: 404 }));
    component.ngOnInit();
    expect(googleService.getStatus).toHaveBeenCalled();
    expect(component.isConnected).toBeFalse();
  });

  it('should init component and check registration response', () => {
    spyOn(googleService, 'getStatus').and.returnValue(of({ syncedApplicationId: 'test', connected: false }));
    spyOnProperty(route, 'queryParamMap').and.returnValue(of({
      get: function (prop: string) {
        if (prop === 'code') { return 'code' } else { return 'scope' }
      }
    }));

    component.ngOnInit();
    expect(googleService.getStatus).toHaveBeenCalled();
    expect(component.isConnected).toBeFalse();
    component.ngOnInit();
  });

  it('should init component, check registration response but not store connection', () => {
    spyOn(googleService, 'getStatus').and.returnValue(of({ syncedApplicationId: 'test', connected: false }));
    spyOnProperty(route, 'queryParamMap').and.returnValue(of({
      get: function (prop: string) {
        if (prop === 'code') { return undefined } else { return 'scope' }
      }
    }));
    spyOn(googleService, 'storeMailSyncSettings');

    component.ngOnInit();
    expect(googleService.getStatus).toHaveBeenCalled();
    expect(component.isConnected).toBeFalse();
    expect(googleService.storeMailSyncSettings).not.toHaveBeenCalled();
  });

  it('should init component and store connection', () => {
    spyOn(googleService, 'getStatus').and.returnValue(of({ syncedApplicationId: 'test', connected: false }));
    spyOn(googleService, 'storeMailSyncSettings').and.returnValue(of({} as any));
    spyOnProperty(route, 'queryParamMap').and.returnValue(of({
      get: function (prop: string) {
        if (prop === 'code') { return 'code' } else { return 'https://www.googleapis.com/auth/gmail.send' }
      }
    }));

    component.ngOnInit();
    expect(googleService.getStatus).toHaveBeenCalled();
    expect(googleService.storeMailSyncSettings).toHaveBeenCalledWith('code');
    expect(component.isConnected).toBeTrue();
  });

  it('should send testmail', () => {
    spyOn(googleService, 'sendTestMail').and.returnValue(of({}));
    component.sendTestMail();
    expect(googleService.sendTestMail).not.toHaveBeenCalled();
    component.emailAddress = 'test@test.com';
    component.sendTestMail();
    expect(googleService.sendTestMail).toHaveBeenCalled();
    expect(component.mailSend).toBeTrue();
    expect(component.emailAddress).toBeNull();
  });

});
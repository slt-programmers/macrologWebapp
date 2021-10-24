import { TestBed, ComponentFixture } from '@angular/core/testing';
import { WebhooksComponent } from './webhooks.component';
import { MockProvider } from 'ng-mocks';
import { WebhookService } from 'src/app/shared/services/webhook.service';
import { of, throwError } from 'rxjs';

describe('WebhooksComponent', () => {
  let component: WebhooksComponent;
  let fixture: ComponentFixture<WebhooksComponent>;
  let webhookService: WebhookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebhooksComponent],
      providers: [
        MockProvider(WebhookService),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WebhooksComponent);
    component = fixture.componentInstance;
    webhookService = TestBed.inject(WebhookService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init component', () => {
    spyOn(webhookService, 'getWebhookStatus').and.returnValue(of({ id: 1 }));
    component.ngOnInit();
    expect(webhookService.getWebhookStatus).toHaveBeenCalledWith('STRAVA');
  });

  it('should disable webhook', () => {
    spyOn(webhookService, 'endWebhook').and.returnValue(of({status: 200}));
    spyOn(webhookService, 'getWebhookStatus').and.returnValue(of({id: 2}))

    component.allWebhooks = [{connectedApp: 'STRAVA', webhook: { id: 1}}]
    component.disableWebhook('STRAVA');
    expect(webhookService.endWebhook).toHaveBeenCalledWith('STRAVA', 1);
  });
  
  it('should not disable webhook if name not found in webhooklist', () => {
    spyOn(webhookService, 'endWebhook').and.returnValue(of({status: 200}));

    component.allWebhooks = [{connectedApp: 'NOTSTRAVA', webhook: { id: 1}}]
    component.disableWebhook('STRAVA');
    expect(webhookService.endWebhook).not.toHaveBeenCalledWith('STRAVA', 1);
  });

  it('should handle error disabling webhook', () => {
    spyOn(webhookService, 'endWebhook').and.returnValue(throwError({status: 404}));
    spyOn(webhookService, 'getWebhookStatus');
    component.allWebhooks = [{connectedApp: 'STRAVA', webhook: { id: 1}}]
    component.disableWebhook('STRAVA');
    expect(webhookService.endWebhook).toHaveBeenCalledWith('STRAVA', 1);
    expect(webhookService.getWebhookStatus).not.toHaveBeenCalledWith('STRAVA');
  });

  it('should enable webhook', () => {
    spyOn(webhookService, 'startWebhook').and.returnValue(of({status: 200}));
    spyOn(webhookService, 'getWebhookStatus').and.returnValue(of({id: 2}))
    component.enableWebhook('STRAVA');
    expect(webhookService.startWebhook).toHaveBeenCalledWith('STRAVA');
  });

  it('should handle error enableing webhook', () => {
    spyOn(webhookService, 'startWebhook').and.returnValue(throwError({status: 404}));
    spyOn(webhookService, 'getWebhookStatus');
    component.enableWebhook('STRAVA');
    expect(webhookService.startWebhook).toHaveBeenCalledWith('STRAVA');
    expect(webhookService.getWebhookStatus).not.toHaveBeenCalled();
  });

  it('should handle error enableing webhook', () => {
    spyOn(webhookService, 'startWebhook').and.returnValue(of({status: 200}));
    spyOn(webhookService, 'getWebhookStatus').and.returnValue(throwError({status: 404}))
    component.enableWebhook('STRAVA');
    expect(webhookService.startWebhook).toHaveBeenCalledWith('STRAVA');
    expect(webhookService.getWebhookStatus).toHaveBeenCalledWith('STRAVA');
    expect(component.allWebhooks).toEqual([]);
  });
});

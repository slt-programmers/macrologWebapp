import { TestBed, ComponentFixture } from '@angular/core/testing';
import { WebhooksComponent } from './webhooks.component';
import { MockProvider } from 'ng-mocks';
import { WebhookService } from 'src/app/shared/services/webhook.service';
import { of } from 'rxjs';

describe('WebhooksComponent', () => {
  let component: WebhooksComponent;
  let fixture: ComponentFixture<WebhooksComponent>;
  let webhookService: WebhookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [WebhooksComponent],
    providers: [
        MockProvider(WebhookService),
    ]
}).compileComponents();

    webhookService = TestBed.inject(WebhookService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(WebhooksComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should init component', () => {
    spyOn(webhookService, 'getWebhookStatus').and.returnValue(of({ id: 1 }));
    fixture = TestBed.createComponent(WebhooksComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    expect(webhookService.getWebhookStatus).toHaveBeenCalledWith('STRAVA');
  });

  it('should disable webhook', () => {
    spyOn(webhookService, 'endWebhook').and.returnValue(of({ status: 200 }));
    spyOn(webhookService, 'getWebhookStatus').and.returnValue(of({ id: 2 }));
    fixture = TestBed.createComponent(WebhooksComponent);
    component = fixture.componentInstance;
    component.allWebhooks = [{ connectedApp: 'STRAVA', webhook: { id: 1 } }]
    component.disableWebhook('STRAVA');
    expect(webhookService.endWebhook).toHaveBeenCalledWith('STRAVA', 1);
  });

  it('should not disable webhook if name not found in webhooklist', () => {
    spyOn(webhookService, 'endWebhook');
    fixture = TestBed.createComponent(WebhooksComponent);
    component = fixture.componentInstance;
    component.allWebhooks = [{ connectedApp: 'NOTSTRAVA', webhook: { id: 1 } }]
    component.disableWebhook('STRAVA');
    expect(webhookService.endWebhook).not.toHaveBeenCalledWith('STRAVA', 1);
  });

  it('should enable webhook', () => {
    spyOn(webhookService, 'startWebhook').and.returnValue(of({ status: 200 }));
    spyOn(webhookService, 'getWebhookStatus').and.returnValue(of({ id: 2 }));
    fixture = TestBed.createComponent(WebhooksComponent);
    component = fixture.componentInstance;
    component.enableWebhook('STRAVA');
    expect(webhookService.startWebhook).toHaveBeenCalledWith('STRAVA');
  });

});

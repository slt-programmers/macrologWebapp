import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { firstValueFrom, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WebhookStatus } from '../model/webhookStatus';
import { WebhookService } from './webhook.service';

describe('WebhookService', () => {
  let service: WebhookService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebhookService,
        MockProvider(HttpClient)
      ],
    });
    service = TestBed.inject(WebhookService);
    http = TestBed.inject(HttpClient);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should get webhook status', async () => {
    spyOn(http, 'get').and.returnValue(of({}));
    const result = await firstValueFrom(service.getWebhookStatus('STRAVA'));
    expect(result).toEqual({} as WebhookStatus);
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/webhooks/STRAVA');
  });

  it('should start webhook ', async () => {
    spyOn(http, 'post').and.returnValue(of([{}]));
    const result = await firstValueFrom(service.startWebhook('STRAVA'));
    expect(result).toEqual([{}]);
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/webhooks/STRAVA', {});
  });

  it('should delete webhook ', async () => {
    spyOn(http, 'delete').and.returnValue(of([{}]));
    const result = await firstValueFrom(service.endWebhook('STRAVA', 1));
    expect(result).toEqual([{}]);
    expect(http.delete).toHaveBeenCalledWith('//' + environment.backend + '/webhooks/STRAVA/1');
  });

});

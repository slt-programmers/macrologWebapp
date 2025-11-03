import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WebhookService } from './webhook.service';
import { WebhookStatus } from '../model/webhookStatus';

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
    const result = await service.getWebhookStatus('STRAVA').toPromise();
    expect(result).toEqual({} as WebhookStatus);
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/webhooks/STRAVA');
  });

  it('should handle error get webhook status', async () => {
    spyOn(http, 'get').and.returnValue(throwError({ status: 404 }));
    const result = await service.getWebhookStatus('STRAVA').toPromise();
    expect(result).toEqual(undefined);
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/webhooks/STRAVA');
  });

  it('should start webhook ', async () => {
    spyOn(http, 'post').and.returnValue(of([{}]));
    const result = await service.startWebhook('STRAVA').toPromise();
    expect(result).toEqual([{}]);
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/webhooks/STRAVA', {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        }
      });
  });

  it('should handle error on start webhook ', async () => {
    spyOn(http, 'post').and.returnValue(throwError({ status: 404 }));
    const result = await service.startWebhook('STRAVA').toPromise();
    expect(result).toEqual(undefined);
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/webhooks/STRAVA', {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        }
      });
  });

  it('should delete webhook ', async () => {
    spyOn(http, 'delete').and.returnValue(of([{}]));
    const result = await service.endWebhook('STRAVA', 1).toPromise();
    expect(result).toEqual([{}]);
    expect(http.delete).toHaveBeenCalledWith('//' + environment.backend + '/webhooks/STRAVA/1',
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        }
      });
  });

  it('should handle error on delete webhook ', async () => {
    spyOn(http, 'delete').and.returnValue(throwError({ status: 404 }));
    const result = await service.endWebhook('STRAVA', 1).toPromise();
    expect(result).toEqual(undefined);
    expect(http.delete).toHaveBeenCalledWith('//' + environment.backend + '/webhooks/STRAVA/1',
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        }
      });
  });

});

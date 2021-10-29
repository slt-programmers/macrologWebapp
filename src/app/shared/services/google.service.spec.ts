import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConnectivityRequest } from '../model/connectivityRequest';
import { ConnectivityStatus } from '../model/connectivityStatus';
import { MailRequest } from '../model/mailRequest';
import { GoogleService } from './google.service';

describe('GoogleService', () => {
  let service: GoogleService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleService,
        MockProvider(HttpClient)],
    });
    service = TestBed.inject(GoogleService);
    http = TestBed.inject(HttpClient);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should get status', async () => {
    spyOn(http, 'get').and.returnValue(of({} as ConnectivityStatus));
    const result = await service.getStatus().toPromise()
    expect(result).toEqual({} as ConnectivityStatus);
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/admin/mail/status', {
      responseType: 'json'
    });
  });

  it('should store mail sync settings', async () => {
    spyOn(http, 'post').and.returnValue(of({} as ConnectivityRequest));
    const result = await service.storeMailSyncSettings('code').toPromise()
    expect(result).toEqual({} as ConnectivityRequest);
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/admin/mail',
      { clientAuthorizationCode: 'code' },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        }
      });
  });

  it('should send testmail', async () => {
    spyOn(http, 'post').and.returnValue(of({} as ConnectivityRequest));
    const result = await service.sendTestMail('adress').toPromise();
    expect(result).toEqual({});

    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/admin/mail/testmail',
      new MailRequest('adress'), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': environment.origin,
      }
    });
  });

});

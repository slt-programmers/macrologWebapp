import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { HealthcheckService } from './healthcheck.service';

describe('HealthcheckService', () => {
  let service: HealthcheckService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HealthcheckService,
        MockProvider(HttpClient),
      ],
    });
    service = TestBed.inject(HealthcheckService);
    http = TestBed.inject(HttpClient);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should check state', async () => {
    spyOn(http, 'get').and.returnValue(of(true));
    const result = await firstValueFrom(service.checkState());
    expect(result).toBeTrue();
  });
});

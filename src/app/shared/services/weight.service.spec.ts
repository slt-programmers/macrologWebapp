import { TestBed } from '@angular/core/testing';
import { WeightService } from './weight.service';
import { ToastService } from './toast.service';
import { MockProvider } from 'ng-mocks';
import { HttpClient } from '@angular/common/http';
import { Weight } from '../model/weight';
import { of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

describe('WeightService', () => {
  let service: WeightService;
  let http: HttpClient;
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WeightService,
        MockProvider(ToastService),
        MockProvider(HttpClient)
      ],
    });
    service = TestBed.inject(WeightService);
    http = TestBed.inject(HttpClient);
    toastService = TestBed.inject(ToastService);
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  it('should get all weights', async () => {
    spyOn(http, 'get').and.returnValue(of([{ weight: 70 } as Weight]));
    const result = await service.getAllWeights().toPromise();
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/weight');
    expect(result).toEqual([{ weight: 70 }]);
  });

  it('should handle error on get all weights', async () => {
    spyOn(http, 'get').and.returnValue(throwError(undefined));
    spyOn(toastService, 'setMessage');
    const result = await service.getAllWeights().toPromise();
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/weight');
    expect(result).toEqual([]);
  });

  it('should store weight', async () => {
    spyOn(http, 'post').and.returnValue(of({}));
    const result = await service.addWeight({ weight: 70 }).toPromise();
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/weight', { weight: 70 },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        }
      });
    expect(result).toEqual({});
  });

  it('should handle error on store weight', async () => {
    spyOn(http, 'post').and.returnValue(throwError(undefined));
    spyOn(toastService, 'setMessage');
    const result = await service.addWeight({ weight: 70 }).toPromise();
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/weight', { weight: 70 },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        }
      });
    expect(result).toEqual(undefined);
  });

  it('should delete weight', async () => {
    spyOn(http, 'delete').and.returnValue(of({}));
    const result = await service.deleteWeight({ weight: 70, id: 1 }).toPromise();
    expect(http.delete).toHaveBeenCalledWith('//' + environment.backend + '/weight/' + '1',
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        }
      });
    expect(result).toEqual({});
  });

  it('should handle error on delete weight', async () => {
    spyOn(http, 'delete').and.returnValue(throwError(undefined));
    spyOn(toastService, 'setMessage');
    const result = await service.deleteWeight({ weight: 70, id: 1 }).toPromise();
    expect(http.delete).toHaveBeenCalledWith('//' + environment.backend + '/weight/' + '1',
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        }
      });
    expect(result).toEqual(undefined);
  });
});

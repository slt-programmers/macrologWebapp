import { TestBed } from '@angular/core/testing';
import { WeightService } from './weight.service';
import { ToastService } from './toast.service';
import { MockProvider } from 'ng-mocks';
import { HttpClient } from '@angular/common/http';
import { Weight } from '../model/weight';
import { firstValueFrom, of } from 'rxjs';
import { environment } from 'src/environments/environment';

describe('WeightService', () => {
  let service: WeightService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WeightService,
        MockProvider(ToastService),
        MockProvider(HttpClient)
      ],
    });
    service = TestBed.inject(WeightService);
    http = TestBed.inject(HttpClient);
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  it('should get all weights', async () => {
    spyOn(http, 'get').and.returnValue(of([{ weight: 70 } as Weight]));
    const result = await firstValueFrom(service.getAllWeights());
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/weight');
    expect(result).toEqual([{ weight: 70 }]);
  });

  it('should store weight', async () => {
    spyOn(http, 'post').and.returnValue(of({}));
    const result = await firstValueFrom(service.addWeight({ weight: 70 }));
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/weight', { weight: 70 });
    expect(result).toEqual({});
  });

  it('should delete weight', async () => {
    spyOn(http, 'delete').and.returnValue(of(undefined));
    const result = await firstValueFrom(service.deleteWeight({ weight: 70, id: 1 }));
    expect(http.delete).toHaveBeenCalledWith('//' + environment.backend + '/weight/' + '1');
    expect(result).toEqual(undefined);
  });

});

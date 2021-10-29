import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Food } from '../model/food';
import { FoodService } from './food.service';
import { ToastService } from './toast.service';

describe('FoodService', () => {
  let service: FoodService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FoodService,
        MockProvider(HttpClient),
        MockProvider(ToastService)
      ],
    });
    service = TestBed.inject(FoodService);
    http = TestBed.inject(HttpClient);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should get all food', async () => {
    spyOn(http, 'get').and.returnValue(of([{ name: 'food' } as Food]));
    const result = await service.getAllFood().toPromise()
    expect(result).toEqual([{ name: 'food' } as Food]);
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/food',
      { responseType: 'json' });
  });

  it('should handle error on get all food', async () => {
    spyOn(http, 'get').and.returnValue(throwError({status: 404}));
    const result = await service.getAllFood().toPromise()
    expect(result).toEqual(undefined);
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/food',
      { responseType: 'json' });
  });

  it('should add food', async () => {
    spyOn(http, 'post').and.returnValue(of({ name: 'food' } as Food));
    const result = await service.addFood({ name: 'food' }).toPromise()
    expect(result).toEqual({ name: 'food' });
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/food/',
      { name: 'food' },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        }
      });
  }); 
  
  it('should handle error on add food', async () => {
    spyOn(http, 'post').and.returnValue(throwError({status: 404}));
    const result = await service.addFood({ name: 'food' }).toPromise()
    expect(result).toEqual(undefined);
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/food/',
      { name: 'food' },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        }
      });
  });

});

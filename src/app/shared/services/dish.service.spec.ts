import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Dish } from '../model/dish';
import { Food } from '../model/food';
import { DishService } from './dish.service';
import { ToastService } from './toast.service';

describe('DishService', () => {
  let service: DishService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DishService,
        MockProvider(HttpClient),
        MockProvider(ToastService)
      ],
    });
    service = TestBed.inject(DishService);
    http = TestBed.inject(HttpClient);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should get all dishes', async () => {
    spyOn(http, 'get').and.returnValue(of([{} as Dish]));
    const result = await service.getAllDishes().toPromise();
    expect(result).toEqual([{} as Dish]);
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/dishes');
  });

  it('should handle error on get all dishes', async () => {
    spyOn(http, 'get').and.returnValue(throwError({ status: 404 }));
    const result = await service.getAllDishes().toPromise();
    expect(result).toEqual(undefined);
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/dishes');
  });

  it('should post dish', async () => {
    spyOn(http, 'post').and.returnValue(of({} as Dish));
    const result = await service.addDish({ name: 'dish', ingredients:[] } as Dish).toPromise();
    expect(result).toEqual({} as Dish);
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/dishes/', 
    { name: 'dish', id: undefined, ingredients: [] },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        }
      });
  });

  it('should handle error on post dish', async () => {
    spyOn(http, 'post').and.returnValue(throwError({ status: 404 }));
    const result = await service.addDish({ name: 'dish', ingredients:[]  } as Dish).toPromise();
    expect(result).toEqual(undefined);
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/dishes/', 
    { name: 'dish', id: undefined, ingredients: [] },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        }
      });
  });

  it('should delete dish', async () => {
    spyOn(http, 'delete').and.returnValue(of(123));
    const result = await service.deleteDish({ id: 123 } as Dish).toPromise();
    expect(result).toEqual(123);
    expect(http.delete).toHaveBeenCalledWith('//' + environment.backend + '/dishes/123',
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        }
      });
  });

  it('should handle error on delete dish', async () => {
    spyOn(http, 'delete').and.returnValue(throwError({ status: 404 }));
    const result = await service.deleteDish({ id: 123 } as Dish).toPromise();
    expect(result).toEqual(undefined);
    expect(http.delete).toHaveBeenCalledWith('//' + environment.backend + '/dishes/123',
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        }
      });
  });

});

import { TestBed } from '@angular/core/testing';
import { DiaryService } from './diary.service';
import { Entry } from '../model/entry';
import { of, throwError } from 'rxjs';
import { MockProvider } from 'ng-mocks';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MacrosPerDay } from '../model/macrosPerDay';

describe('DiaryService', () => {
  let service: DiaryService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DiaryService,
        MockProvider(HttpClient)],
    });
    service = TestBed.inject(DiaryService);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  it('should get logs for date', async () => {
    spyOn(http, 'get').and.returnValue(of([{}]));
    const result = await service.getLogsForDay('2019-01-01').toPromise();
    expect(result).toEqual([{} as Entry]);
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/logs/day/2019-01-01');
  });

  it('should handle error on get logs for date', async () => {
    spyOn(http, 'get').and.returnValue(throwError({ status: 404 }));
    const result = await service.getLogsForDay('2019-01-01').toPromise();
    expect(result).toEqual(undefined);
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/logs/day/2019-01-01');
  });

  it('should get macros', async () => {
    spyOn(http, 'get').and.returnValue(of([{}]));
    const result = await service.getMacrosPerDay('2019-01-01', '2019-02-01').toPromise();
    expect(result).toEqual([{} as MacrosPerDay]);
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/logs/macros', {
      params: { from: '2019-01-01', to: '2019-02-01' },
      responseType: 'json'
    });
  });

  it('should handle error on get macros', async () => {
    spyOn(http, 'get').and.returnValue(throwError({ status: 404 }));
    const result = await service.getMacrosPerDay('2019-01-01', '2019-02-01').toPromise();
    expect(result).toEqual(undefined);
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/logs/macros', {
      params: { from: '2019-01-01', to: '2019-02-01' },
      responseType: 'json'
    });
  });

  it('should add entries', async () => {
    spyOn(http, 'post').and.returnValue(of([{}]))
    const result = await service.addEntries([{}]).toPromise();;
    expect(result).toEqual([{} as Entry]);
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/logs/', [{}], {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': environment.origin,
      }
    })
  });

  it('should handle error on add entries', async () => {
    spyOn(http, 'post').and.returnValue(throwError({ status: 404 }));
    const result = await service.addEntries([{}]).toPromise();;
    expect(result).toEqual(undefined);
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/logs/', [{}], {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': environment.origin,
      }
    });
  });

  it('should delete entry', async () => {
    spyOn(http, 'delete').and.returnValue(of(123));
    const result = await service.deleteEntry({ id: 123 } as Entry).toPromise();
    expect(result).toEqual(123);
    expect(http.delete).toHaveBeenCalledWith('//' + environment.backend + '/logs/123', {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': environment.origin,
      }
    });
  });

  it('should handle error on delete entry', async () => {
    spyOn(http, 'delete').and.returnValue(throwError({ status: 404 }));
    const result = await service.deleteEntry({ id: 123 } as Entry).toPromise();
    expect(result).toEqual(undefined);
    expect(http.delete).toHaveBeenCalledWith('//' + environment.backend + '/logs/123', {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': environment.origin,
      }
    });
  });
});

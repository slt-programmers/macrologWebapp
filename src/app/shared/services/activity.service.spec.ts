import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { MockPipe, MockProvider } from "ng-mocks";
import { of, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { Activity } from "../model/activity";
import { ActivityService } from "./activity.service";

describe('ActivityService', () => {
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ActivityService,
        MockProvider(HttpClient)],
        declarations: [
          MockPipe(DatePipe)
        ]
    });
    http = TestBed.inject(HttpClient);
  });

  it('should create', () => {
    const service = TestBed.inject(ActivityService);
    expect(service).toBeTruthy();
  });

  it('should get activities for date', async () => {
    spyOn(http, 'get').and.returnValue(of([{}]));
    const service = TestBed.inject(ActivityService);
    const result = await service.getActivitiesForDate("2020-01-01").toPromise();
    expect(result).toEqual([{} as Activity]);
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/activities/day/2020-01-01');
  });

  it('should handle error on get activities for date', async () => {
    spyOn(http, 'get').and.returnValue(throwError({ status: 404 }));
    const service = TestBed.inject(ActivityService);
    const result = await service.getActivitiesForDate("2020-01-01").toPromise();
    expect(result).toEqual(undefined);
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/activities/day/2020-01-01');
  });

  it('should get activities for date forced', async () => {
    spyOn(http, 'get').and.returnValue(of([{}]));
    const service = TestBed.inject(ActivityService);
    const result = await service.getActivitiesForDateForced("2020-01-01").toPromise();
    expect(result).toEqual([{} as Activity]);
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/activities/day/2020-01-01?forceSync=true');
  });

  it('should handle error on get activities for date forced', async () => {
    spyOn(http, 'get').and.returnValue(throwError({ status: 404 }));
    const service = TestBed.inject(ActivityService);
    const result = await service.getActivitiesForDateForced("2020-01-01").toPromise();
    expect(result).toEqual(undefined);
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/activities/day/2020-01-01?forceSync=true');
  });

  it('should add activities', async () => {
    spyOn(http, 'post').and.returnValue(of([{}]));
    const service = TestBed.inject(ActivityService);
    const result = await service.addActivities('2021-01-01', [{}]).toPromise();
    expect(result).toEqual([{} as Activity]);
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/activities/', [undefined],
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin
        }
      });
  });

  it('should handle error on add activities', async () => {
    spyOn(http, 'post').and.returnValue(throwError({ status: 404 }));
    const service = TestBed.inject(ActivityService);
    const result = await service.addActivities('2021-01-01', [{}]).toPromise();
    expect(result).toEqual(undefined);
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/activities/', [undefined],
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin
        }
      });
  });

  it('should delete activity', async () => {
    spyOn(http, 'delete').and.returnValue(of(123));
    const service = TestBed.inject(ActivityService);
    const result = await service.deleteActivity({ id: 123 } as Activity).toPromise();
    expect(result).toEqual(123);
    expect(http.delete).toHaveBeenCalledWith('//' + environment.backend + '/activities/123',
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin
        }
      });
  });

  it('should handle error on  delete activity', async () => {
    spyOn(http, 'delete').and.returnValue(throwError({status: 404}));
    const service = TestBed.inject(ActivityService);
    const result = await service.deleteActivity({ id: 123 } as Activity).toPromise();
    expect(result).toEqual(undefined);
    expect(http.delete).toHaveBeenCalledWith('//' + environment.backend + '/activities/123',
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin
        }
      });
  });
});
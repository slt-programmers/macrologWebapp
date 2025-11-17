import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { ActivityService } from './activity.service';
import { environment } from 'src/environments/environment';

describe('ActivityService', () => {
  let service: ActivityService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActivityService,
        MockProvider(HttpClient)],
    });
    service = TestBed.inject(ActivityService);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  it('should get activities for day', () => {
    spyOn(http, 'get');
    service.getActivitiesForDay('2020-01-01');
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/activities/day/2020-01-01');
    service.getActivitiesForDay('2020-01-01', true);
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/activities/day/2020-01-01?forceSync=true');
  });

  it('should post activities for day', () => {
    spyOn(http, 'post');
    service.postActivitiesForDay('2020-01-01', []);
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/activities/day/2020-01-01', []);
  });
});

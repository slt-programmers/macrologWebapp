import { TestBed } from '@angular/core/testing';
import { AdminService } from './admin.service';
import { UserAccount } from '../model/userAccount';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MockProvider } from 'ng-mocks';

describe('AdminService', () => {
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminService,
        MockProvider(HttpClient)],
    });
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create admin service', () => {
    const service = TestBed.inject(AdminService);
    expect(service).toBeTruthy();
  });

  it('should get all users', async () => {
    spyOn(http, 'get').and.returnValue(of([{}]));
    const service = TestBed.inject(AdminService);
    const result = await service.getAllUsers().toPromise();
    expect(result).toEqual([{} as UserAccount]);
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/admin/getAllUsers');
  });

  it('should delete user', async () => {
    spyOn(http, 'post').and.returnValue(of({}));
    const service = TestBed.inject(AdminService);
    const result = await service.deleteUser({ id: 123 } as UserAccount).toPromise();
    expect(result).toEqual({});
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/admin/deleteAccount', null,
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        }, params: { userId: '123' }
      });
  });

  it('should handle error on delete user', async () => {
    spyOn(http, 'post').and.returnValue(throwError({status: 404}));
    const service = TestBed.inject(AdminService);
    const result = await service.deleteUser({ id: 123 } as UserAccount).toPromise();
    expect(result).toEqual(undefined);
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/admin/deleteAccount', null,
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        }, params: { userId: '123' }
      });
  });
});

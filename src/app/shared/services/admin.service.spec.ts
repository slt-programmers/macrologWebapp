import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AdminService } from './admin.service';
import { UserAccount } from '../../model/userAccount';

describe('AdminService', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create admin service', () => {
    const service = TestBed.inject(AdminService);
    expect(service).toBeTruthy();
  });

  it('should get all users', fakeAsync(() => {
    const mockResponse: UserAccount[] = [
      { id: 1, userName: 'userOne', token: null, email: 'email', admin: false },
      { id: 2, userName: 'userTwo', token: null, email: 'email', admin: true },
    ];
    const service = TestBed.inject(AdminService);
    service.getAllUsers().subscribe((res) => {
      expect(res.length).toEqual(2);
      expect(res).toEqual(mockResponse);
    });
    const request = http.expectOne(service.macrologBackendUrl + '/getAllUsers');
    expect(request.request.method).toEqual('GET');
    request.flush(mockResponse);
    tick();
    http.verify();
  }));

  it('should not get all users', fakeAsync(() => {
    const mockResponse = { status: 401 };
    const service = TestBed.inject(AdminService);
    service.getAllUsers().subscribe(
      () => {},
      (err) => {
        expect(err.status).toEqual(mockResponse.status);
      }
    );
    const request = http.expectOne(service.macrologBackendUrl + '/getAllUsers');
    expect(request.request.method).toEqual('GET');
    request.flush(mockResponse);
    tick();
    http.verify();
  }));

  it('should delete user', fakeAsync(() => {
    const service = TestBed.inject(AdminService);
    const userAccount: UserAccount = {} as UserAccount;
    userAccount.id = 123;
    const mockResponse = { status: 200 };

    service.deleteUser(userAccount).subscribe(
      (res: any) => {
        expect(res.status).toEqual(200);
      },
      () => {}
    );

    const request = http.expectOne(
      service.macrologBackendUrl + '/deleteAccount?userId=123'
    );
    expect(request.request.method).toEqual('POST');
    request.flush(mockResponse);
    tick();
    http.verify();
  }));
});

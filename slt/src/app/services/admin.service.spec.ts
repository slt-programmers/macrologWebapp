import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminService } from "./admin.service";
import { UserAccount } from "@app/model/userAccount";

describe('AdminService', () => {
    let http: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AdminService]
        });
        http = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        localStorage.clear();
    })

    it('should create admin service', () => {
        const service = TestBed.get(AdminService);
        expect(service).toBeTruthy();
    });

    it('should get all users', fakeAsync(() => {
        const mockResponse = [
            { id: 1, name: 'userOne', token: null, email: 'email', isAdmin: false },
            { id: 2, name: 'userTwo', token: null, email: 'email', isAdmin: true },
        ];
        const service = TestBed.get(AdminService);
        service.getAllUsers().subscribe(
            res => {
                expect(res.length).toEqual(2);
                expect(res).toEqual(mockResponse);
                err => { }
            }
        );
        const request = http.expectOne(service.macrologBackendUrl + '/getAllUsers');
        expect(request.request.method).toEqual('GET');
        request.flush(mockResponse);
        tick();
        http.verify();
    }));

    it('should not get all users', fakeAsync(() => {
        const mockResponse = { status: 401 }
        const service = TestBed.get(AdminService);
        service.getAllUsers().subscribe(
            () => { },
            err => {
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
        const service = TestBed.get(AdminService);
        const userAccount = new UserAccount();
        userAccount.id = 123;
        const mockResponse = { status: 200 };

        service.deleteUser(userAccount).subscribe(
            res => {
                expect(res.status).toEqual(200);
            }, 
            () => {}
        );

        const request = http.expectOne(service.macrologBackendUrl + '/deleteAccount?userId=123');
        expect(request.request.method).toEqual('POST');
        request.flush(mockResponse);
        tick();
        http.verify();
    }));

})
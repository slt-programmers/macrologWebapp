import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { AdminService } from '@app/services/admin.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatTableModule } from '@angular/material';
import { ToastService } from '@app/services/toast.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { UserAccount } from '@app/model/userAccount';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let adminService: AdminService;
  let toastService: ToastService;

  const allUsers = [
    { userName: 'CarmenDev', email: 'c.scholte.lubberink@gmail.com', id: 1, admin: true, token: '' },
    { userName: 'Arjan', email: 'c.scholte.lubberink@gmail.com', id: 2, admin: true, token: '' },
    { userName: 'Testtest', email: 'test@mailinator.com', id: 3, admin: false, token: '' }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminComponent],
      imports: [MatTableModule, HttpClientTestingModule],
      providers: [AdminService, ToastService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    adminService = TestBed.get(AdminService);
    toastService = TestBed.get(ToastService);
    fixture.detectChanges();
  });

  it('should create admin component', () => {
    expect(component).toBeTruthy();
  });

  it('should init admin component', fakeAsync(() => {
    spyOn(adminService, 'getAllUsers').and.returnValue(of(allUsers))
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    expect(component.allUsers[0].userName).toEqual('CarmenDev');
  }));

  it('should delete user', fakeAsync(() => {
    spyOn(adminService, 'deleteUser').and.returnValue(of({}));
    spyOn(toastService, 'setMessage');
    const userAccount = new UserAccount();
    userAccount.id = 123;
    component.deleteUser(userAccount);
    expect(adminService.deleteUser).toHaveBeenCalledWith(userAccount);
    tick();
    fixture.detectChanges();
    expect(toastService.setMessage).toHaveBeenCalledWith('User account successfully deleted');
  }));

  it('should not delete user', fakeAsync(() => {
    spyOn(toastService, 'setMessage');
    spyOn(adminService, 'deleteUser').and.returnValue(throwError({status: 401}));
    const userAccount = { userName: 'user', id: 123 }

    component.deleteUser(userAccount);
    expect(adminService.deleteUser).toHaveBeenCalledWith(userAccount);
    tick();
    fixture.detectChanges();
    expect(toastService.setMessage).toHaveBeenCalledWith('User account could not be deleted');
  }));

});

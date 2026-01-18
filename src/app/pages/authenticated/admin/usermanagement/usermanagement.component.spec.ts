import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { UserAccount } from 'src/app/shared/model/userAccount';
import { AdminService } from 'src/app/shared/services/admin.service';
import { UserManagementComponent } from './usermanagement.component';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let adminService: AdminService;

  const allUsers = [
    {
      userName: 'CarmenDev',
      email: 'c.scholte.lubberink@gmail.com',
      id: 1,
      admin: false,
      token: '',
    },
    {
      userName: 'Arjan',
      email: 'c.scholte.lubberink@gmail.com',
      id: 2,
      admin: true,
      token: '',
    },
    {
      userName: 'Testtest',
      email: 'test@mailinator.com',
      id: 3,
      admin: false,
      token: '',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserManagementComponent],
      providers: [MockProvider(AdminService)],
    }).compileComponents();

    adminService = TestBed.inject(AdminService);

    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('should init usermanagement component', async () => {
    spyOn(adminService, 'getAllUsers').and.returnValue(of(allUsers));
    component.ngOnInit();
    expect(component.allUsers).toEqual(allUsers);
    expect(adminService.getAllUsers).toHaveBeenCalled();
  });

  it('should open and close delete user modal', () => {
    const userAccount: UserAccount = {} as UserAccount;
    userAccount.id = 123;
    userAccount.userName = 'Test';
    component.openModalWithUser(userAccount);
    expect(component.isModalVisible).toBeTrue();
    component.closeModal();
    expect(component.isModalVisible).toBeFalse();
  });

  it('should delete user', () => {
    spyOn(adminService, 'getAllUsers').and.returnValue(of(allUsers));
    spyOn(adminService, 'deleteUser').and.returnValue(of(undefined));
    const userAccount: UserAccount = {} as UserAccount;
    userAccount.id = 123;
    component.selectedUser = userAccount;
    component.deleteUser();
    expect(adminService.deleteUser).toHaveBeenCalledWith(userAccount);
    fixture.detectChanges();
    expect(component.selectedUser).toBeUndefined();
    expect(adminService.getAllUsers).toHaveBeenCalled();
    expect(component.isModalVisible).toBeFalse();
  });

  it('should not delete user when none selected', () => {
    spyOn(adminService, 'getAllUsers').and.returnValue(of(allUsers));
    spyOn(adminService, 'deleteUser');
    component = TestBed.createComponent(UserManagementComponent).componentInstance;
    component.selectedUser = undefined;
    component.deleteUser();
    expect(adminService.deleteUser).not.toHaveBeenCalled();
    expect(adminService.getAllUsers).not.toHaveBeenCalled();
  });

});

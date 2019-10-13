import { Component, OnInit } from '@angular/core';
import { AdminService } from '@app/services/admin.service';
import { UserAccount } from '@app/model/userAccount';
import { ToastService } from '@app/services/toast.service';

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.scss']
})
export class UserManagementComponent implements OnInit {

  public allUsers: UserAccount[];
  public isModalVisible = false;
  public userName: string;
  public displayedColumns: string[] = ['id', 'name', 'email', 'delete'];

  public selectedUser: UserAccount;

  constructor(private adminService: AdminService,
    private toastService: ToastService) { }

  ngOnInit() {
    this.getAllUsers();
  }

  private getAllUsers() {
    this.adminService.getAllUsers().subscribe(
      res => {
        this.allUsers = res;
      },
      err => {
        // TODO handle error
      }
    );
  }

  public closeModal() {
    this.isModalVisible = false;
  }

  public openModalWithUser(user: UserAccount) {
    this.selectedUser = user;
    this.isModalVisible = true;
  }

  public deleteUser() {
    this.adminService.deleteUser(this.selectedUser).subscribe(
      res => {
        this.toastService.setMessage('User account successfully deleted');
        this.getAllUsers();
      },
      err => {
        this.toastService.setMessage('User account could not be deleted');
      },
      () => {
        this.selectedUser = undefined;
        this.closeModal();
      });
  }
}

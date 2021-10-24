import { Component, OnInit } from '@angular/core';
import { UserAccount } from 'src/app/shared/model/userAccount';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.scss'],
})
export class UserManagementComponent implements OnInit {
  public allUsers: UserAccount[] = []
  public isModalVisible = false;
  public userName: string = '';

  public selectedUser: UserAccount | undefined;

  constructor(
    private adminService: AdminService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.getAllUsers();
  }

  private getAllUsers() {
    console.log(this.allUsers)
    this.adminService.getAllUsers().subscribe(
      (res) => {
        console.log(res);
        this.allUsers = res;
        console.log(this.allUsers)
      },
      (err) => {
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
    if (this.selectedUser) {
      this.adminService.deleteUser(this.selectedUser).subscribe(
        () => {
          this.toastService.setMessage('User account successfully deleted');
          this.getAllUsers();
        },
        () => {
          this.toastService.setMessage('User account could not be deleted');
        },
        () => {
          this.selectedUser = undefined;
          this.closeModal();
        }
      );
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { UserAccount } from 'src/app/shared/model/userAccount';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html'
})
export class UserManagementComponent implements OnInit {
  public allUsers: UserAccount[] = []
  public isModalVisible = false;
  public userName: string = '';

  public selectedUser: UserAccount | undefined;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.getAllUsers();
  }

  private getAllUsers() {
    this.adminService.getAllUsers().subscribe((it) => {
      this.allUsers = it;
    });
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
      this.adminService.deleteUser(this.selectedUser).subscribe(it => {
        this.getAllUsers();
        this.selectedUser = undefined;
        this.closeModal();
      });
    }
  }
}

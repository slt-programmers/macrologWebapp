import { Component, OnInit } from '@angular/core';
import { UserAccount } from 'src/app/shared/model/userAccount';
import { AdminService } from 'src/app/shared/services/admin.service';
import { NgIf, NgFor } from '@angular/common';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'ml-usermanagement',
    templateUrl: './usermanagement.component.html',
    imports: [NgIf, NgFor, ModalComponent, FormsModule]
})
export class UserManagementComponent implements OnInit {
  public allUsers: UserAccount[] = []
  public isModalVisible = false;
  public userName: string = undefined;

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
        this.userName = undefined;
        this.closeModal();
      });
    }
  }
}

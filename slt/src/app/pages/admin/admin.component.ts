import { Component, OnInit } from '@angular/core';
import { AdminService } from '@app/services/admin.service';
import { UserAccount } from '@app/model/userAccount';
import { ToastService } from '@app/services/toast.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public allUsers: UserAccount[];

  public displayedColumns: string[] = ['id', 'name', 'email', 'delete'];

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
        console.log(err);
      }
    );
  }

  public deleteUser(user) {
    this.adminService.deleteUser(user).subscribe(
      res => {
        this.toastService.setMessage('User account successfully deleted');
        this.getAllUsers();
      },
      err => {
        this.toastService.setMessage('User account could not be deleted');
      });
  }

}

import { Component, OnInit } from '@angular/core';
import { AdminService } from '@app/services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public allUsers = [
    { name: 'CarmenDev', email: 'c.scholte.lubberink@gmail.com', id: 1 },
    { name: 'Arjan', email: 'c.scholte.lubberink@gmail.com', id: 2},
    { name: 'Testtest', email: 'test@mailinator.com', id: 3}
  ]
  public displayedColumns: string[] = ['id', 'name', 'email', 'delete'];

  
  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.getAllUsers().subscribe(
      res => {
        // this.allUsers = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  public deleteUser(user) {
    this.adminService.deleteUser(user);
  }

}

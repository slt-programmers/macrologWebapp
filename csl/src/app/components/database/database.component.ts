import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DatabaseEntryComponent } from './database-entry/database-entry.component';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.css']
})
export class DatabaseComponent {

  constructor(public dialog: MatDialog) {

  }

  openDialog(): void {

    const dialogRef = this.dialog.open(DatabaseEntryComponent, {
      width: '360px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

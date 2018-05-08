import {Component} from'@angular/core';
import {MatDialog, MatDialogRef}from '@angular/material';

@Component({
  selector: 'app-database-entry',
  templateUrl: './database-entry.component.html',
  styleUrls: ['./database-entry.component.css']
})
export class DatabaseEntryComponent {

	model = [];
	selectedUnit;
	foodName = '';
	unitName = '';
	unitGram = '';

	constructor(public dialogRef: MatDialogRef<DatabaseEntryComponent>) {
		this.selectedUnit = 1;
	}

	closeDialog(): void {
		this.dialogRef.close();
	}

}
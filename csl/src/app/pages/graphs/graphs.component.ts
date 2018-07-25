import { Component, OnInit } from '@angular/core';
import {LogService}from '../../services/log.service';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss']
})
export class GraphsComponent implements OnInit {

   public macrosMonth;

  constructor(private logService: LogService,private sanitizer: DomSanitizer) { }

  ngOnInit() {
     this.getMacros();
  }

  ngAfterViewChecked(){
     let pipe = new DatePipe('en-US');
     for (let dayMacro of this.macrosMonth) {
       let fetchDate = pipe.transform(dayMacro.day,'ddMMyyyy');
       let protein = document.getElementById('protein_'+fetchDate);
       let fat = document.getElementById('fat_'+fetchDate);
       let carbs = document.getElementById('carbs_'+fetchDate);
       let available = document.getElementById('day_'+fetchDate);
       if (!protein || !fat || !carbs || !available) return;

       let availableHeight = available.style.height; // = 100%

       protein.style.height = Math.round(dayMacro.macro.protein) + 'px';
       fat.style.height = Math.round(dayMacro.macro.fat) + 'px';
       carbs.style.height = Math.round(dayMacro.macro.carbs) + 'px';
    }


  }


  getMacros(){
    let pipe = new DatePipe('en-US');
    let fetchDate = pipe.transform(new Date(),'dd-MM-yyyy');
    let fetchDate2 = pipe.transform(new Date(),'dd-MM-yyyy');
    this.logService.getMacros(fetchDate,fetchDate2).subscribe(
      data => {
          this.macrosMonth = data;
      }
    )
  }

}

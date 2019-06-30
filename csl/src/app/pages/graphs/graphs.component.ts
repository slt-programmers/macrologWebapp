import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { AfterContentInit } from '@angular/core';
import { ViewChild, ElementRef  } from '@angular/core';

import { LogService} from '../../services/log.service';
import { UserService } from '../../services/user.service';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import * as d3 from 'd3';
import { LogEntry } from '../../model/logEntry';
import * as moment from 'moment';
import { filter } from 'rxjs/operators';


@Component({
	selector: 'app-graphs',
	templateUrl: './graphs.component.html'
})
export class GraphsComponent implements AfterContentInit  {


 @ViewChild('svgcontainer') dataContainer: ElementRef;

 barWidth=20;
 radius = 30;
 marginLeft=70;

 graphLegenda=20;

 splitted=true;
 percentages=false;

 zoomX = 1;
 zoomXCalories=1;

 splitOffset=10;

 maxProtein=0;
 maxFat=0;
 maxCarbs=0;
 maxTotal=0;
 maxCalories=0;

 maxProteinPerc=0;
 maxFatPerc=0;
 maxCarbsPerc=0;

 clientWidth = 0;
 clientHeight =0;

 public userGoals;
 public goalCal;

 public loading=true;
 public allLogs = new Array();
 public infoMacro = null;

 logBars = new Array();

 public dateFrom;
 public dateTo;

  ngAfterContentInit() {

    this.dateFrom = moment().subtract(1,'months');
    this.dateTo = moment();
    this.getData();
    this.getGoals();
  }

  getSVGWidth(){
     return this.marginLeft + 33 * this.barWidth;
//   return this.clientWidth;
  }
  getSVGHeight(){
    return this.clientHeight * 0.66;
  }

  getSVGHeightCalories(){
    return this.clientHeight * 0.33;
  }

 getData(){
    this.loading=true;
    this.getGoals();
    this.logBars = new Array();
    this.allLogs = new Array();
    this.logService.getMacros(this.dateFrom.format('YYYY-MM-DD'), this.dateTo.format('YYYY-MM-DD')).subscribe(
			data => {
				this.allLogs = data;
        this.matchLogs();
		//	this.clientWidth =  this.dataContainer.nativeElement.clientWidth;
			this.clientHeight = this.dataContainer.nativeElement.clientHeight * 0.8;
			this.calculateZoom();
        this.loading=false;
			},
			error => { console.log(error);
				this.allLogs = new Array();
			}
		); }

  getGoals(){
		this.userService.getUserGoalStats(this.dateFrom.format('YYYY-MM-DD')).subscribe(
			data => {
				if (data[0] === null) {
					this.userGoals = null;
				} else {
					this.userGoals = data;
				}
				this.setGoalCal();
			},
			error => console.log(error)
		);
	}

  private setGoalCal() {
		if (this.userGoals) {
			this.goalCal = (this.userGoals[0] * 4)
				+ (this.userGoals[1] * 9)
				+ (this.userGoals[2] * 4);
		}
	}

  matchLogs() {
    let pointerDate = this.dateFrom.clone();
    while (pointerDate.isBefore(this.dateTo)) {
       let filtered = 	this.allLogs.filter(i => i.day === pointerDate.format('YYYY-MM-DD'))[0];
       if (filtered){
          let total = filtered.macro.protein + filtered.macro.fat + filtered.macro.carbs;

          this.maxProtein = Math.max(this.maxProtein, filtered.macro.protein);
          this.maxFat = Math.max(this.maxFat,filtered.macro.fat);
          this.maxCarbs = Math.max(this.maxCarbs, filtered.macro.carbs);
          this.maxTotal = Math.max(this.maxTotal, filtered.macro.protein+filtered.macro.fat+filtered.macro.carbs);
          this.maxCalories = Math.max(this.maxCalories, filtered.macro.calories);

          this.maxProteinPerc = Math.max(this.maxProteinPerc, filtered.macro.protein * 100 /total);
          this.maxFatPerc = Math.max(this.maxFatPerc,filtered.macro.fat  * 100 /total);
          this.maxCarbsPerc = Math.max(this.maxCarbsPerc, filtered.macro.carbs  * 100 /total);

          this.logBars.push(filtered)
       } else {
          this.logBars.push({'day':pointerDate.format('YYYY-MM-DD')})
       }
       pointerDate.add(1,'day');
    }
    console.log("matched");
  }

  monthBack(){
     this.dateTo = this.dateFrom.clone();
     this.dateFrom = this.dateFrom.clone().subtract(1, 'months');
     this.getData();

  }
  monthForward(){
     this.dateFrom = this.dateTo.clone();
     this.dateTo = this.dateTo.clone().add(1, 'months');
     this.getData();
  }


  getYPosProtein(logEntry) {
     if (this.splitted) {
       return this.getSVGHeight() - this.graphLegenda - this.getHeightProtein(logEntry)
     } else {
       return this.getSVGHeight() - this.graphLegenda - this.getHeightProtein(logEntry)
     }
  }

  getYPosCalories(logEntry) {
    return this.getSVGHeightCalories() - this.graphLegenda - this.getHeightCalories(logEntry)
  }

 getHeightCalories(logEntry) {
    if (!logEntry || !logEntry.macro ) {return 0}

    return logEntry.macro.calories * this.zoomXCalories;
  }

  getHeightProtein(logEntry) {
    if (!logEntry || !logEntry.macro ) {return 0}
    if (this.percentages) {
      let total =  logEntry.macro.protein + logEntry.macro.fat + logEntry.macro.carbs;
      let percentage = logEntry.macro.protein * 100 / total;
      return percentage * this.zoomX;
    } else {
      return logEntry.macro.protein * this.zoomX;
    }
  }

  getYPosFat(logEntry){
     if (this.splitted) {
        if (this.percentages){
          return this.getSVGHeight() - this.graphLegenda - (this.splitOffset + this.maxProteinPerc * this.zoomX + this.getHeightFat(logEntry));
        } else {
          return this.getSVGHeight() - this.graphLegenda - (this.splitOffset + this.maxProtein * this.zoomX + this.getHeightFat(logEntry));
        }

     } else {
       return this.getSVGHeight() - this.graphLegenda - (this.getHeightProtein(logEntry) + this.getHeightFat(logEntry))
     }
  }
  getHeightFat(logEntry) {
    if (!logEntry || !logEntry.macro ) {
      return 0
    }
    if (this.percentages) {
      let total =  logEntry.macro.protein + logEntry.macro.fat + logEntry.macro.carbs;
      let percentage = logEntry.macro.fat * 100 / total;
      return percentage * this.zoomX;
    } else {
      return logEntry.macro.fat * this.zoomX;
    }
  }

  getYPosCarbs(logEntry){
     if (this.splitted) {
        if (this.percentages){
          let maxUsed = this.maxProteinPerc + this.maxFatPerc;
          return this.getSVGHeight() - this.graphLegenda- (this.splitOffset*2 + maxUsed * this.zoomX  + this.getHeightCarbs(logEntry))
        } else {
          return this.getSVGHeight() - this.graphLegenda- (this.splitOffset*2 + this.maxProtein * this.zoomX + this.maxFat * this.zoomX + this.getHeightCarbs(logEntry))
        }
     } else {
        return this.getSVGHeight() - this.graphLegenda- (this.getHeightProtein(logEntry) +this.getHeightFat(logEntry) + this.getHeightCarbs(logEntry))
     }
  }

  getHeightCarbs(logEntry) {
    if (!logEntry || !logEntry.macro ) {return 0}
    if (this.percentages) {
      let total =  logEntry.macro.protein + logEntry.macro.fat + logEntry.macro.carbs;
      let percentage = logEntry.macro.carbs * 100 / total;
      return percentage * this.zoomX;
    } else {
      return logEntry.macro.carbs * this.zoomX;
     }
  }

  getGoalProteinPos(){
    if (this.percentages){
       return this.getYPosProtein(null) -  this.getGoalProtein() * this.zoomX	;
    } else {
      return this.getYPosProtein(null) -  this.getGoalProtein() * this.zoomX;
    }
  }

  getGoalFatPos(){
    if (this.splitted) {
      return this.getYPosFat(null) -  this.getGoalFat() * this.zoomX;
    } else {
      return this.getYPosFat(null) -  (this.getGoalFat() * this.zoomX + this.getGoalProtein() * this.zoomX);
    }
   }

  getGoalCarbsPos(){
    if (this.splitted) {
      return this.getYPosCarbs(null) -  this.getGoalCarbs() * this.zoomX;
    } else {
      return this.getYPosCarbs(null) -  (this.getGoalProtein() * this.zoomX + this.getGoalFat() * this.zoomX + this.getGoalCarbs() * this.zoomX);
    }
  }

 getGoalCaloriesPos(){
    return this.getYPosCalories(null) -  (this.getGoalCalories() * this.zoomXCalories);
  }
 getGoalCalories(){
    return this.goalCal;
  }


 getGoalProtein(){
    if (this.percentages) {
      let total = this.userGoals[0] + this.userGoals[1] + this.userGoals[2];
      let percentage =  this.userGoals[0] *100/ total
      return percentage;
    } else {
      return this.userGoals[0]
    }
  }

  getGoalFat(){
    if (this.percentages) {
      let total = this.userGoals[0] + this.userGoals[1] + this.userGoals[2];
      let percentage =  this.userGoals[1] *100/ total
      return percentage;
    } else {
       return  this.userGoals[1];
    }
  }

  getGoalCarbs(){
    if (this.percentages) {
      let total = this.userGoals[0] + this.userGoals[1] + this.userGoals[2];
      let percentage =  this.userGoals[2] *100/ total
      return percentage;
    } else {
       return  this.userGoals[2];
    }
  }

 calculateZoom(){

    if (!this.getSVGHeight()) {
       this.zoomX=0;
       this.zoomXCalories=0;
       return;
    }

    if (this.percentages) {
      if (this.splitted) {
        this.zoomX = (this.getSVGHeight() - 40) / (this.maxProteinPerc+ this.maxFatPerc + this.maxCarbsPerc);
      } else {
         this.zoomX = (this.getSVGHeight() -40 ) / 100 ;
      }
    } else {
      if (this.splitted) {
         this.zoomX = (this.getSVGHeight() - 40) / (this.maxProtein+ this.maxFat + this.maxCarbs);
      } else {
					 this.zoomX = (this.getSVGHeight() -40 ) / this.maxTotal ;
      }
     }
console.log(this.maxCalories);
console.log(this.getSVGHeightCalories());
     this.zoomXCalories = (this.getSVGHeightCalories() - 40) / this.maxCalories;


 }

 constructor(private logService: LogService,
             private userService: UserService) {}


 public showMacros(logEntry){
   if (logEntry.macro) {
    this.infoMacro = logEntry;
   } else {
     this.infoMacro = null;
   }
 }

}

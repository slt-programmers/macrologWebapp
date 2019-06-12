import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { AfterContentInit } from '@angular/core';
import {LogService} from '../../services/log.service';
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

 barWidth=20;
 radius = 30;

 graphWidth=650;
 graphHeight=500;
 graphLegenda=20;

 splitted=false;
 percentages=true;

 zoomX = 2;

 splitOffset=10;

 maxProtein=0;
 maxFat=0;
 maxCarbs=0;

 maxProteinPerc=0;
 maxFatPerc=0;
 maxCarbsPerc=0;

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
    this.calculateZoom();

  }

 getData(){
    this.loading=true;
    this.logBars = new Array();
    this.allLogs = new Array();
    this.logService.getMacros(this.dateFrom.format('YYYY-MM-DD'), this.dateTo.format('YYYY-MM-DD')).subscribe(
			data => {
				this.allLogs = data;
        this.matchLogs();
        this.loading=false;
			},
			error => { console.log(error);
				this.allLogs = new Array();
			}
		); }

  getGoals(){
		this.userService.getUserGoalStats().subscribe(
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

          this.maxProteinPerc = Math.max(this.maxProteinPerc, filtered.macro.protein * 100 /total);
          this.maxFatPerc = Math.max(this.maxFatPerc,filtered.macro.fat  * 100 /total);
          this.maxCarbsPerc = Math.max(this.maxCarbsPerc, filtered.macro.carbs  * 100 /total);

          this.logBars.push(filtered)
       } else {
          this.logBars.push({'day':pointerDate.format('YYYY-MM-DD')})
       }
       pointerDate.add(1,'day');
    }
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




  showPercentage = true;

  getYPosProtein(logEntry) {
     if (this.splitted) {
       return this.graphHeight - this.graphLegenda - this.getHeightProtein(logEntry)
     } else {
       return this.graphHeight - this.graphLegenda - this.getHeightProtein(logEntry)
     }
  }

  getHeightProtein(logEntry) {
    if (!logEntry || !logEntry.macro ) {return 0}
    if (this.percentages) {
      let total =  logEntry.macro.protein + logEntry.macro.fat + logEntry.macro.carbs;
      let percentage = logEntry.macro.protein * 100 / total;
      return percentage / this.zoomX;
    } else {
      return logEntry.macro.protein / this.zoomX;
    }
  }

  getYPosFat(logEntry){
     if (this.splitted) {
        if (this.percentages){
          return this.graphHeight - this.graphLegenda - (this.splitOffset + this.maxProteinPerc /this.zoomX + this.getHeightFat(logEntry));
        } else {
          return this.graphHeight - this.graphLegenda - (this.splitOffset + this.getGoalProtein()/this.zoomX + this.getHeightFat(logEntry));
        }

     } else {
       return this.graphHeight - this.graphLegenda - (this.getHeightProtein(logEntry) + this.getHeightFat(logEntry))
     }
  }
  getHeightFat(logEntry) {
    if (!logEntry || !logEntry.macro ) {
      return 0
    }
    if (this.percentages) {
      let total =  logEntry.macro.protein + logEntry.macro.fat + logEntry.macro.carbs;
      let percentage = logEntry.macro.fat * 100 / total;
      return percentage / this.zoomX;
    } else {
      return logEntry.macro.fat/ this.zoomX;
    }
  }

  getYPosCarbs(logEntry){
     if (this.splitted) {
        if (this.percentages){

          let maxUsed = this.maxProteinPerc + this.maxFatPerc;
          console.log(maxUsed)
          return this.graphHeight - this.graphLegenda- (this.splitOffset*2 + maxUsed/this.zoomX  + this.getHeightCarbs(logEntry))
        } else {
          return this.graphHeight - this.graphLegenda- (this.splitOffset*2 + this.maxProtein/2 + this.maxFat/2 + this.getHeightCarbs(logEntry))
        }
     } else {
        return this.graphHeight - this.graphLegenda- (this.getHeightProtein(logEntry) +this.getHeightFat(logEntry) + this.getHeightCarbs(logEntry))
     }
  }

  getHeightCarbs(logEntry) {
    if (!logEntry || !logEntry.macro ) {return 0}
    if (this.percentages) {
      let total =  logEntry.macro.protein + logEntry.macro.fat + logEntry.macro.carbs;
      let percentage = logEntry.macro.carbs * 100 / total;
      return percentage / this.zoomX;
    } else {
      return logEntry.macro.carbs/ this.zoomX;
     }
  }

  getGoalProteinPos(){
    if (this.percentages){
       return this.getYPosProtein(null) -  this.getGoalProtein()/this.zoomX	;
    } else {
      return this.getYPosProtein(null) -  this.getGoalProtein()/this.zoomX;
    }
  }

  getGoalFatPos(){
    if (this.splitted) {
      return this.getYPosFat(null) -  this.getGoalFat()/this.zoomX;
    } else {
      return this.getYPosFat(null) -  (this.getGoalFat()/this.zoomX + this.getGoalProtein()/this.zoomX);
    }
   }

  getGoalCarbsPos(){
    if (this.splitted) {
      return this.getYPosCarbs(null) -  this.getGoalCarbs()/this.zoomX;
    } else {
      return this.getYPosCarbs(null) -  (this.getGoalProtein()/this.zoomX + this.getGoalFat()/this.zoomX + this.getGoalCarbs()/this.zoomX);
    }
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
    if (this.percentages) {
      if (this.splitted) {
        this.zoomX = 0.3;
      } else {
        this.zoomX = 0.3;
      }
    } else {
       this.zoomX =2;
    }
   console.log(this.zoomX)
 }

 constructor(private logService: LogService,
             private userService: UserService) {}


  data = [
    {"x":10, "y":100,"r":20,"c":"red"},
    {"x":130, "y":60,"r":40,"c":"green"},
    {"x":360, "y":200,"r":20,"c":"orange"}
        ];


 public showMacros(logEntry){
   if (logEntry.macro) {
    this.infoMacro = logEntry;
   } else {
     this.infoMacro = null;
   }
 }
 clicked(event: any) {
    d3.select(event.target).append('circle')
      .attr('cx', event.x)
      .attr('cy', event.y)
      .attr('r', () => {
        return this.radius;
      })
      .attr('fill', 'red');
}
}

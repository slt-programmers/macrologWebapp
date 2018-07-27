import {Component, OnInit, OnChanges, ViewChild, SimpleChange, SimpleChanges, Renderer, ElementRef, Input,Output ,EventEmitter}from '@angular/core';
import {DatePipe} from '@angular/common';
import {LogEntry} from '../../model/logEntry';
import {StoreLogRequest} from '../../model/storeLogRequest';
import {FoodService} from '../../services/food.service';
import {LogService} from '../../services/log.service';
import {Food} from '../../model/food';
import {ToastService} from '../../services/toast.service';


@Component({
  selector: 'log-meal',
  templateUrl: './log-meal.component.html',
  styleUrls: ['./log-meal.component.scss'],
	host: { '(document: click)': 'closeAutoComplete($event)' }
})
export class LogMealComponent implements OnInit, OnChanges {

	@ViewChild('logMeal') private logMealEref: ElementRef;
	@ViewChild('newIngredient') private newIngredientEref: ElementRef;
	@ViewChild('autoComplete') private autoCompleteEref: ElementRef;

	@Input() food;
  @Input() meal: string;
  @Input() logEntries: LogEntry[];
	@Input() date: Date;
	@Input() open: boolean;

	@Output() dataChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  public editable: boolean;
	public foodMatch;
	public foodName: string;
	public showAutoComplete: boolean;

	private pipe: DatePipe;

  constructor (private foodService: FoodService,
               private logService: LogService,
               private renderer: Renderer,
               private toastService: ToastService) {
    this.editable = false;
		this.foodMatch = new Array();
		this.pipe = new DatePipe('en-US');
	}

  ngOnInit() {
	}

  ngAfterViewChecked(){
  }

	ngOnChanges(changes) {
		if (changes['date'] && this.editable) {
			this.saveAndClose();
		} else if (changes['open'] && !changes['open'].firstChange) {
			if (changes['open'].currentValue) {
				this.editable = true;
			} else {
				this.saveAndClose();
			}
		}
	}

  public close(){
    this.editable = false;
  }

  public setMultiplier(event,logEntry){
	  if (event.data == '.') {
		  return logEntry.multiplier;
	  }

    if (!logEntry.portion &&  logEntry.food.measurementUnit == 'GRAMS'){
      logEntry.multiplier = (event.target.value / logEntry.food.unitGrams);
    } else {
      logEntry.multiplier = event.target.value;
    }

    return logEntry.multiplier;
  }

  public getValue(logEntry) {
    if (!logEntry.portion && logEntry.food.measurementUnit == 'GRAMS'){
      return Math.round(logEntry.multiplier * logEntry.food.unitGrams);
    } else  {
      return logEntry.multiplier;
    }
  }

	public findFoodMatch(event) {
		this.foodMatch = new Array<Food>();
		if (event.data !== null) {
			for (let item of this.food) {
        let matchFoodName = item.food.name.toLowerCase().indexOf(this.foodName.toLowerCase()) >=0 ;
				if (matchFoodName) {
					this.foodMatch.push(item);
				}
			}
		}
	}

  public copyPrevious() {
    let prevDay = new Date(this.date.getTime());
    prevDay.setDate(prevDay.getDate() - 1);
    let copyFrom = this.pipe.transform(prevDay, 'yyyy-MM-dd');
    this.toastService.setMessage(this.meal + ' has been copied from ' + copyFrom);

    for (let oldEntry of this.logEntries){
		  this.logService.deleteLogEntry(oldEntry);
      this.updateCalculatedMacros(oldEntry);
    }
    this.logService.getDayLogs(copyFrom).subscribe(
      data => {
        let tmpData = data;
        let filtered = new Array();
        filtered = tmpData.filter(
              entry => entry.meal === this.meal.toUpperCase()
         );
        for (let copiedEntry of filtered) {
           let logEntry = new LogEntry();
           logEntry.meal = copiedEntry.meal;
		       logEntry.food = copiedEntry.food;
		       if (copiedEntry.portion) {
			          logEntry.portion = copiedEntry.portion;
		       }
           logEntry.multiplier = copiedEntry.multiplier;
           this.updateCalculatedMacros(logEntry);
		       logEntry.day = this.date;
           this.logEntries.push(logEntry);
           this.updateCalculatedMacros(logEntry);
        }
      }
    );

 }

  public amountChange(logEntry) {
     this.updateCalculatedMacros(logEntry);
  }

  private getAvailablePortions(logEntry) {
      for (let item of this.food) {
        // in foodSearchable zitten dubbele entries en ook zonder portions
				if (item.food.id == logEntry.food.id) {
					return item.food.portions;
				}
			}
      return undefined;
  }

  private getSpecificPortion(logEntry, portionDescription) {
     let availablePortions = this.getAvailablePortions(logEntry);
     for (let portion of availablePortions) {
        if (portion.description == portionDescription){
           return portion;
        }
     }
     return undefined;
  }

  private updateCalculatedMacros(logEntry){
    let protein =  this.calculateProtein(logEntry);
    let carbs = this.calculateCarbs(logEntry)
    let fat = this.calculateFat(logEntry)
    let calories = (protein * 4) + (fat * 9) + (carbs * 4);
    logEntry.macrosCalculated = { protein: protein, fat: fat, carbs: carbs, calories: calories };
  }

  public portionChange(logEntry, eventTarget){
    let oldValue = logEntry.portion;
    if (oldValue){ // indien geen portion gebruikt
      oldValue = oldValue.description;
    } else {
      oldValue = 'defaultUnit';
    }
    let newValue = eventTarget.value;

    if (oldValue == 'defaultUnit' && newValue != 'defaultUnit'){
       // van default naar een portie.
       // Dit gaan we niet omrekenen, maar de gebruiker moet de oude waarde blijven zien.
       logEntry.portion = this.getSpecificPortion(logEntry, newValue);
       if (logEntry.food.measurementUnit == 'GRAMS'){
         logEntry.multiplier = logEntry.multiplier * logEntry.food.unitGrams;
       }

    } else if (newValue =='defaultUnit') {
      // van een portie naar default. Dit gaan we omrekenen.
      let oldPortion = this.getSpecificPortion(logEntry, oldValue);

      logEntry.portion = undefined;
      if (logEntry.food.measurementUnit == 'GRAMS'){
         let oldAmount = logEntry.multiplier * oldPortion.grams;
         logEntry.multiplier = oldAmount / logEntry.food.unitGrams;
      } else {
         let oldAmount = logEntry.multiplier * oldPortion.unitMultiplier;
         logEntry.multiplier = oldAmount;
      }

    } else {
      // wisselen tussen porties. Eerst naar default unit en dan naar nieuwe unit.
      // TODO :)

    }
    // set de macros calculated! dan kun je dat terug emitten en hoeft daar het niet nogmaals uitgerekend te worden
     this.updateCalculatedMacros(logEntry);
  }

  public getSelected(logEntryPortion, portion) {
     if (!logEntryPortion){ // geen portion geselecteerd, dus select default
       return "selected";
     } if (logEntryPortion && portion && logEntryPortion.id == portion.id){ // portion geselecteerd. is dit het?
        return "selected";
     } else {
        return "";
     }
  }

	public addLogEntry(foodSearchable) {
		let logEntry = new LogEntry();
    logEntry.meal = this.meal.toUpperCase();
		logEntry.food = foodSearchable.food;
		if (foodSearchable.portion) {
			logEntry.portion = foodSearchable.portion;
		}
    logEntry.multiplier = 1;

    this.updateCalculatedMacros(logEntry);
		logEntry.day = this.date;
		this.logEntries.push(logEntry);
	}

  private calculateProtein(logEntry){
     if (logEntry.portion){
        return (logEntry.multiplier * logEntry.portion.macros.protein);
     } else {
        if (logEntry.food.measurementUnit == "UNIT"){
           return (logEntry.multiplier * logEntry.food.protein);
        } else {
           return (logEntry.multiplier * logEntry.food.protein);
        }
     }
  }

  private calculateFat(logEntry){
    if (logEntry.portion){
        return (logEntry.multiplier * logEntry.portion.macros.fat);
    } else {
       if (logEntry.food.measurementUnit == "UNIT"){
          return (logEntry.multiplier * logEntry.food.fat);
       } else {
          return (logEntry.multiplier * logEntry.food.fat);
       }
    }
  }

  private calculateCarbs(logEntry){
     if (logEntry.portion){
        return (logEntry.multiplier * logEntry.portion.macros.carbs);
     } else {
        if (logEntry.food.measurementUnit == "UNIT"){
           return (logEntry.multiplier * logEntry.food.carbs);
        } else {
           return (logEntry.multiplier * logEntry.food.carbs);
        }
     }
  }

	public deleteLogEntry(logEntry: LogEntry) {
    let index: number = this.logEntries.indexOf(logEntry);
    if (index !== -1) {
       this.logEntries.splice(index, 1);
		}
		this.logService.deleteLogEntry(logEntry);
	}

	public saveAndClose() {
		this.close();
    let allEntries = [];
    for (let logEntry of this.logEntries) {
      let newRequest = new StoreLogRequest();
      newRequest.id = logEntry.id;
      newRequest.foodId = logEntry.food.id;
      if (logEntry.portion){
         newRequest.portionId = logEntry.portion.id;
      }
      newRequest.multiplier = logEntry.multiplier;
      newRequest.day = this.pipe.transform(logEntry.day, 'yyyy-MM-dd');
      newRequest.meal = this.meal.toUpperCase();
      allEntries.push(newRequest);
    }
      let closeCallBack = () => {
        this.dataChanged.emit(true);
		  }
      this.logService.storeLogEntries(allEntries, closeCallBack);
	}


	// Autocomplete

  public matchDescription(foodSearchable) {
		if (foodSearchable.portion) {
      return foodSearchable.food.name + " (" + foodSearchable.portion.description + ")";
    } else {
			if (foodSearchable.food.measurementUnit == "UNIT"){
        return foodSearchable.food.name + " (" + foodSearchable.food.unitName +" )";
      } else {
        return foodSearchable.food.name + " (" + foodSearchable.food.unitGrams  + " " + foodSearchable.food.unitName +" )";
			}
    }
  }

	public onKeyDown(event) {
		let autoCompleteInputSelected = document.activeElement.classList.contains('meal__new-ingredient__input');
		let autoCompleteOptionSelected = document.activeElement.classList.contains('autocomplete__option');
		let nodelist = this.autoCompleteEref.nativeElement.childNodes;

		if(this.autoCompleteEref) {
			if(autoCompleteInputSelected) {
				if(event.key === 'ArrowDown') {
					event.preventDefault();
					for (let index = 0; index < nodelist.length; index++) {
						if (nodelist[index].localName === 'div') {
							this.renderer.invokeElementMethod(nodelist[index], 'focus');
							break;
						}
					}
				}
			} else if (autoCompleteOptionSelected) {
				if(event.key === 'ArrowDown') {
					event.preventDefault();
					let activeElement = document.activeElement;
					let nextSibling = activeElement.nextSibling;
					for (;;) {
						if (nextSibling && nextSibling.localName !== 'div') {
							nextSibling = nextSibling.nextSibling;
						} else if (nextSibling) {
							this.renderer.invokeElementMethod(nextSibling, 'focus');
							break;
						} else {
							break;
						}
					}
				} else if (event.key === 'ArrowUp') {
					event.preventDefault();
					let activeElement = document.activeElement;
					let previousSibling = activeElement.previousSibling;
					for (;;) {
						if (previousSibling && previousSibling.localName !== 'div') {
							previousSibling = previousSibling.previousSibling;
						} else if(previousSibling) {
							this.renderer.invokeElementMethod(previousSibling, 'focus');
							break;
						} else {
							break;
						}
					}
				}
			}
		}
	}

	public closeAutoComplete(event) {
		//Event vuurt 4x door 4 log-meal-components
		if (this.newIngredientEref && !this.newIngredientEref.nativeElement.contains(event.target)) {
			this.showAutoComplete = false;
		}
	}

}

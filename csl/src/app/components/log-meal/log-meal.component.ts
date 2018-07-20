import{Component, OnInit, OnChanges, ViewChild, SimpleChanges, Renderer, ElementRef, Input,Output ,EventEmitter}from '@angular/core';
import {LogEntry }from '../../model/logEntry';
import {StoreLogRequest}from '../../model/storeLogRequest';
import {FoodService}from '../../services/food.service';
import {LogService}from '../../services/log.service';
import {Food} from '../../model/food';

@Component({
  selector: 'log-meal',
  templateUrl: './log-meal.component.html',
  styleUrls: ['./log-meal.component.scss'],
	host: { '(document: click)': 'closeAutoComplete($event)' }
})
export class LogMealComponent implements OnInit, OnChanges {

	@ViewChild('newIngredient') private newIngredientEref: ElementRef;
	@ViewChild('autoComplete') private autoCompleteEref: ElementRef;
	@ViewChild('test') private testRef: ElementRef;

	@Input() food;
  @Input() meal: string;
  @Input() logEntries: LogEntry[];

  public editable: boolean = false;
	public foodMatch = new Array();
	public foodName: string;
	public showAutoComplete: boolean;

  constructor ( private foodService: FoodService, private logService: LogService,private renderer: Renderer) { }

  ngOnInit() { }

	ngOnChanges(changes) {

	}

	findFoodMatch(event) {
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

  getAvailablePortions(logEntry) {
      for (let item of this.food) {
        // in foodSearchable zitten dubbele entries en ook zonder portions
				if (item.food.id == logEntry.food.id) {
					return item.food.portions;
				}
			}
      return undefined;
  }

  getSpecificPortion(logEntry, portionDescription) {
     let availablePortions = this.getAvailablePortions(logEntry);
     for (let portion of availablePortions) {
        if (portion.description == portionDescription){
           return portion;
        }
     }
     return undefined;
  }

  amountChange(logEntry, eventTarget) {
     this.updateCalculatedMacros(logEntry);
  }

  updateCalculatedMacros(logEntry){
    let protein =  this.calculateProtein(logEntry);
    let carbs = this.calculateCarbs(logEntry)
    let fat = this.calculateFat(logEntry)
    let calories = (protein * 4) + (fat * 9) + (carbs * 4);
    logEntry.macrosCalculated = { protein: protein, fat: fat, carbs: carbs, calories: calories };

  }

  portionChange(logEntry, eventTarget){
    let oldValue = logEntry.portion;
    if (oldValue){ // indien geen portion gebruikt
      oldValue = oldValue.description;
    } else {
      oldValue = 'defaultUnit';
    }
    let newValue = eventTarget.value;
    console.log('Change from ' + oldValue + ' to ' + newValue);

    if (oldValue == 'defaultUnit' && newValue != 'defaultUnit'){
       // van default naar een portie.
       // Dit gaan we niet omrekenen, maar de gebruiker moet de oude waarde blijven zien.
       logEntry.portion = this.getSpecificPortion(logEntry, newValue);
       if (logEntry.food.measurementUnit == 'GRAMS'){
         logEntry.multiplier = logEntry.multiplier * logEntry.food.unitGrams;
       }
       console.log(logEntry.portion);

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

  getSelected(logEntryPortion, portion){
     if (!logEntryPortion){ // geen portion geselecteerd, dus select default
       return "selected";
     } if (logEntryPortion && portion && logEntryPortion.id == portion.id){ // portion geselecteerd. is dit het?
        return "selected";
     } else {
        return "";
     }
  }

	addLogEntry(foodSearchable) {
    console.log('addLogEntry');
		console.log(foodSearchable);
		let logEntry = new LogEntry();
    logEntry.meal = this.meal.toUpperCase();
		logEntry.food = foodSearchable.food;
		if (foodSearchable.portion) {
			logEntry.portion = foodSearchable.portion;
		}
    logEntry.multiplier = 1;

    this.updateCalculatedMacros(logEntry);
		logEntry.day = new Date();

    console.log('result:');
		console.log(logEntry);
		this.logEntries.push(logEntry);
	}

  calculateProtein(logEntry){
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

  calculateFat(logEntry){
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

  calculateCarbs(logEntry){
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

  calculateCalories(logEntry){
		return logEntry.macrosCalculated.calories;
  }

  matchDescription(foodSearchable) {
   if (foodSearchable.portion){
     return foodSearchable.food.name + " (" + foodSearchable.portion.description + ")";
   } else {
     if (foodSearchable.food.measurementUnit == "UNIT"){
        return foodSearchable.food.name + " (" + foodSearchable.food.unitName +" )";
     } else {
        return foodSearchable.food.name + " (" + foodSearchable.food.unitGrams  + " " + foodSearchable.food.unitName +" )";
      }
   }
  }

	onKeyDown(event) {
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

	closeAutoComplete(event) {
		if (this.newIngredientEref && !this.newIngredientEref.nativeElement.contains(event.target)) {
			this.showAutoComplete = false;
		}
	}

	deleteLogEntry(logEntry: LogEntry) {
		console.log(logEntry);
    let index: number = this.logEntries.indexOf(logEntry);
    if (index !== -1) {
       this.logEntries.splice(index, 1);
		}
		this.logService.deleteLogEntry(logEntry);
	}

	saveAndClose() {
		this.editable = !this.editable;
    for (let logEntry of this.logEntries) {
      let newRequest = new StoreLogRequest();
      newRequest.id = logEntry.id;
      newRequest.foodId = logEntry.food.id;
      if (logEntry.portion){
         newRequest.portionId = logEntry.portion.id;
      }
      newRequest.multiplier = logEntry.multiplier;
      newRequest.day = logEntry.day;
      newRequest.meal = this.meal.toUpperCase();
      this.logService.storeLogEntry(newRequest);
    }
	}
}

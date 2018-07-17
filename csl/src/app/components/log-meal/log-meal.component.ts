import { Component, OnInit, OnChanges, ViewChild, SimpleChanges, Renderer, ElementRef, Input,Output ,EventEmitter} from '@angular/core';
import { LogEntry } from '../../model/logEntry';
import { StoreLogRequest } from '../../model/storeLogRequest';
import { FoodService } from '../../services/food.service';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'log-meal',
  templateUrl: './log-meal.component.html',
  styleUrls: ['./log-meal.component.scss'],
	host: { '(document: click)': 'closeAutoComplete($event)' }
})
export class LogMealComponent implements OnInit {

	@ViewChild('newIngredient') private newIngredientEref: ElementRef;
	@ViewChild('autoComplete') private autoCompleteEref: ElementRef;
	@ViewChild('test') private testRef: ElementRef;

	@Input() food;
  @Input() meal: string;
  @Input() logEntries: LogEntry[];
  @Output() notify:EventEmitter<LogEntry> = new EventEmitter<LogEntry>();

  public editable: boolean = false;
	public foodMatch = new Array();
	public foodName: string;
	public showAutoComplete: boolean;

  constructor ( private foodService: FoodService, private logService: LogService,private renderer: Renderer) { }

  ngOnInit() {

  }

	onChange() {

	}

	findFoodMatch(event) {
		this.foodMatch = new Array();
		if (event.data !== null) {
			for (let item of this.food) {
				if (item.name.toLowerCase().startsWith(this.foodName.toLowerCase())) {
					this.foodMatch.push(item);
				}
			}
		}
	}

  getAvailablePortions(foodEntry) {
      for (let item of this.food) {
				if (item.id == (foodEntry.food.id)) {
					return item.portions;
				}
			}
  }

  getSpecificPortion(foodEntry, portionDescription) {
     let availablePortions = this.getAvailablePortions(foodEntry);
     for (let portion of availablePortions) {
        if (portion.description == portionDescription){
           return portion;
        }
     }
     return undefined;
  }

  amountChange(foodEntry, eventTarget) {
     this.updateCalculatedMacros(foodEntry);
  }
  updateCalculatedMacros(foodEntry){
    let protein =  this.calculateProtein(foodEntry);
    let carbs = this.calculateCarbs(foodEntry)
    let fat = this.calculateFat(foodEntry)
    let calories = fat*9 + carbs*4 + protein*4;
    foodEntry.macrosCalculated = {'protein':protein,'fat':fat,'carbs':carbs,'calories':calories};
    this.notify.emit(foodEntry);
  }

  portionChange(foodEntry, eventTarget){
    let oldValue = foodEntry.portion;
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
       foodEntry.portion = this.getSpecificPortion(foodEntry, newValue);
       if (foodEntry.food.measurementUnit == 'GRAMS'){
         foodEntry.multiplier = foodEntry.multiplier * foodEntry.food.unitGrams;
       }
       console.log(foodEntry.portion);

    } else if (newValue =='defaultUnit') {
      // van een portie naar default. Dit gaan we omrekenen.
      let oldPortion = this.getSpecificPortion(foodEntry, oldValue);

      foodEntry.portion = undefined;
      if (foodEntry.food.measurementUnit == 'GRAMS'){
         let oldAmount = foodEntry.multiplier * oldPortion.grams;
         foodEntry.multiplier = oldAmount / foodEntry.food.unitGrams;
      } else {
         let oldAmount = foodEntry.multiplier * oldPortion.unitMultiplier;
         foodEntry.multiplier = oldAmount;
      }

    } else {
      // wisselen tussen porties. Eerst naar default unit en dan naar nieuwe unit.
      // TODO :)

    }
    // set de macros calculated! dan kun je dat terug emitten en hoeft daar het niet nogmaals uitgerekend te worden
     this.updateCalculatedMacros(foodEntry);
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

	addLogEntry(food) {
		let entry = new LogEntry();
		entry.food = food;
		if (food.portions) {
			entry.portion = food.portions[0];
		}
		this.logEntries.push(entry);
	}

  calculateProtein(currEntry){
     if (currEntry.portion){
        return (currEntry.multiplier * currEntry.portion.macros.protein);
     } else {
        if (currEntry.food.measurementUnit == "UNIT"){
           return (currEntry.multiplier * currEntry.food.unitGrams * currEntry.food.protein);
        } else {
           return (currEntry.multiplier * currEntry.food.protein);
        }
     }
  }

  calculateFat(currEntry){
    if (currEntry.portion){
        return (currEntry.multiplier * currEntry.portion.macros.fat);
     } else {
        if (currEntry.food.measurementUnit == "UNIT"){
           return (currEntry.multiplier * currEntry.food.unitGrams * currEntry.food.fat);
        } else {
           return (currEntry.multiplier * currEntry.food.fat);
        }
     }
  }

  calculateCarbs(currEntry){
     if (currEntry.portion){
        return (currEntry.multiplier * currEntry.portion.macros.carbs);
     } else {
        if (currEntry.food.measurementUnit == "UNIT"){
           return (currEntry.multiplier * currEntry.food.unitGrams * currEntry.food.carbs);
        } else {
           return (currEntry.multiplier * currEntry.food.carbs);
        }
     }
  }

  calculateCalories(currEntry){
		return currEntry.macrosCalculated.calories;
  }

	onKeyDown(event) {
		console.log(event);
		console.log(document.activeElement);
		console.log(document.activeElement.classList.contains('meal__new-ingredient__input'));
		if(this.autoCompleteEref) {
			if(document.activeElement.classList.contains('meal__new-ingredient__input')) {
				if(event.code === 'ArrowDown') {
					let nodelist = this.autoCompleteEref.nativeElement.childNodes;
					for (let index = 0; index < nodelist.length; index++) {
						if (nodelist[index] !== 'comment') {
							this.renderer.invokeElementMethod(nodelist[index], 'focus');
							break;
						}
					}
				}
				if(event.code === 'ArrowUp') {

				}
			} else {
				// option selected
			}
		}
	}

	closeAutoComplete(event) {
		if (this.newIngredientEref && !this.newIngredientEref.nativeElement.contains(event.target)) {
			this.showAutoComplete = false;
		}
	}

	saveAndClose() {
		//TODO: SAVE
		this.editable = !this.editable;
		console.log('save and close');
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
      console.log('store log');
      console.log(newRequest);
      this.logService.storeLogEntry(newRequest);
    }
    console.log(this.logEntries[0]);
    this.notify.emit(this.logEntries[0])
	}
}

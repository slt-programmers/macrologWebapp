import { Component, OnInit, OnChanges, ViewChild, SimpleChanges, Renderer, ElementRef, Input } from '@angular/core';
import { LogEntry } from '../../model/logEntry';
import { FoodService } from '../../services/food.service';

@Component({
  selector: 'log-meal',
  templateUrl: './log-meal.component.html',
  styleUrls: ['./log-meal.component.scss'],
	host: { '(document: click)': 'closeAutoComplete($event)' }
})
export class LogMealComponent implements OnInit {

	@ViewChild('newIngredient') private newIngredientEref: ElementRef;
	@ViewChild('autoComplete') private autoCompleteEref: ElementRef;

	@Input() food;
  @Input() meal: string;
  @Input() logEntries: LogEntry[];

  public editable: boolean = false;
	public foodMatch = new Array();
	public foodName: string;
	public showAutoComplete: boolean;

  constructor ( private foodService: FoodService, private renderer: Renderer) { }

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
       foodEntry.multiplier = foodEntry.multiplier * foodEntry.food.unitGrams;
       console.log(foodEntry.portion);

    } else if (newValue =='defaultUnit') {
      // van een portie naar default. Dit gaan we omrekenen.
      let oldPortion = this.getSpecificPortion(foodEntry, oldValue);
      let oldAmount = foodEntry.multiplier * oldPortion.grams;

      foodEntry.portion = undefined;
      foodEntry.multiplier = oldAmount / foodEntry.food.unitGrams;

    } else {
      // wisselen tussen porties

    }
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
		return this.calculateFat(currEntry) * 9 + this.calculateProtein(currEntry) * 4 + this.calculateCarbs(currEntry) * 4;
  }

	onKeyDown(event) {
		console.log(event);
		console.log(document.activeElement.classList.contains('//TODO Class toevoegen'));
		if(this.autoCompleteEref) {
			if(event.code === 'ArrowDown') {
				console.log(this.autoCompleteEref);
				console.log(this.autoCompleteEref.nativeElement.childNodes[1]);

        this.renderer.invokeElementMethod(this.autoCompleteEref.nativeElement.childNodes[1], 'focus');

			}
			if(event.code === 'ArrowUp') {

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
	}
}

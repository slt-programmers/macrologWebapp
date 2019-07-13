import { Component, OnInit, OnChanges, ViewChild, SimpleChange, SimpleChanges,
	Renderer, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LogEntry } from '../../model/logEntry';
import { StoreLogRequest } from '../../model/storeLogRequest';
import { FoodService } from '../../services/food.service';
import { LogService } from '../../services/log.service';
import { FoodSearchable } from '../../model/foodSearchable';
import { ToastService } from '../../services/toast.service';

@Component({
	selector: 'log-meal',
	templateUrl: './log-meal.component.html'
})
export class LogMealComponent implements OnInit, OnChanges {

	@ViewChild('logMeal',  {static: false}) private logMealEref: ElementRef;

	@Input() searchables: FoodSearchable[];
	@Input() meal: string;
	@Input() logEntries: LogEntry[];
	@Input() date: Date;
	@Input() open: boolean;

	@Output() dataChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

	public editable: boolean;
	public addLogEntryCallBack: Function;

	public unitGrams: number = 100.00;
	public unitName: string = 'gram';

	private pipe: DatePipe;

	constructor(private foodService: FoodService,
							private logService: LogService,
							private renderer: Renderer,
							private toastService: ToastService) {
		this.editable = false;
		this.pipe = new DatePipe('en-US');
	}

	ngOnInit() {
		this.addLogEntryCallBack = this.addLogEntry.bind(this);
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

	public close() {
		this.editable = false;
	}

	public setMultiplier(event, logEntry) {
		if (event.data === '.') {
			return logEntry.multiplier;
		}

		if (!logEntry.portion) {
			logEntry.multiplier = (event.target.value / this.unitGrams);
		} else {
			logEntry.multiplier = event.target.value;
		}

		return logEntry.multiplier;
	}

	public getValue(logEntry) {
		if (!logEntry.portion) {
			return Math.round(logEntry.multiplier * this.unitGrams);
		} else {
			return logEntry.multiplier;
		}
	}

	public copyPrevious() {
		const prevDay = new Date(this.date.getTime());
		prevDay.setDate(prevDay.getDate() - 1);
		const copyFrom = this.pipe.transform(prevDay, 'yyyy-MM-dd');
		this.toastService.setMessage(this.meal + ' has been copied from ' + copyFrom);

		for (const oldEntry of this.logEntries) {
			this.logService.deleteLogEntry(oldEntry);
			this.updateCalculatedMacros(oldEntry);
		}

		this.logService.getDayLogs(copyFrom).subscribe(
			data => {
				const tmpData = data;
				let filtered = new Array();
				filtered = tmpData.filter(
					entry => entry.meal === this.meal.toUpperCase()
				);
				for (const copiedEntry of filtered) {
					const logEntry = new LogEntry();
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
		for (const item of this.searchables) {
			// in foodSearchable zitten dubbele entries en ook zonder portions
			if (item.food.id === logEntry.food.id) {
				return item.food.portions;
			}
		}
		return undefined;
	}

	private getSpecificPortion(logEntry, portionDescription) {
		const availablePortions = this.getAvailablePortions(logEntry);
		for (const portion of availablePortions) {
			if (portion.description === portionDescription) {
				return portion;
			}
		}
		return undefined;
	}

	private updateCalculatedMacros(logEntry) {
		const protein =  this.calculateProtein(logEntry);
		const carbs = this.calculateCarbs(logEntry);
		const fat = this.calculateFat(logEntry);
		const calories = (protein * 4) + (fat * 9) + (carbs * 4);
		logEntry.macrosCalculated = { protein: protein, fat: fat, carbs: carbs, calories: calories };
	}

	public portionChange(logEntry, eventTarget) {
		let oldValue = logEntry.portion;
		if (oldValue) { // indien geen portion gebruikt
			oldValue = oldValue.description;
		} else {
			oldValue = 'defaultUnit';
		}
		const newValue = eventTarget.value;

		if (oldValue === 'defaultUnit' && newValue !== 'defaultUnit') {
			// van default naar een portie.
			// Dit gaan we niet omrekenen, maar de gebruiker moet de oude waarde blijven zien.
			logEntry.portion = this.getSpecificPortion(logEntry, newValue);
			logEntry.multiplier = logEntry.multiplier * this.unitGrams;
		} else if (newValue === 'defaultUnit') {
			// van een portie naar default. Dit gaan we omrekenen.
			const oldPortion = this.getSpecificPortion(logEntry, oldValue);
			logEntry.portion = undefined;
			const oldAmount = logEntry.multiplier * oldPortion.grams;
			logEntry.multiplier = oldAmount / this.unitGrams;
		} else {
			// wisselen tussen porties. Eerst naar default unit en dan naar nieuwe unit.
			// TODO :)
		}
		// set de macros calculated! dan kun je dat terug emitten en hoeft daar het niet nogmaals uitgerekend te worden
		this.updateCalculatedMacros(logEntry);
	}

	public getSelected(logEntryPortion, portion) {
		if (!logEntryPortion) { // geen portion geselecteerd, dus select default
			return 'selected';
		} if (logEntryPortion && portion && logEntryPortion.id === portion.id) { // portion geselecteerd. is dit het?
			return 'selected';
		} else {
			return '';
		}
	}

	public addLogEntry(foodSearchable) {
		if (foodSearchable.food.ingredients) {
			for (const ingredient of foodSearchable.food.ingredients) {
				const logEntry = new LogEntry();
				logEntry.meal = this.meal.toUpperCase();
				logEntry.food = ingredient.food;
				if (ingredient.portion) {
					logEntry.portion = ingredient.portion;
				}
				logEntry.multiplier = ingredient.multiplier;
				this.updateCalculatedMacros(logEntry);
				logEntry.day = this.date;
				this.logEntries.push(logEntry);
			}
		} else {
			const logEntry = new LogEntry();
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
	}

	private calculateProtein(logEntry) {
		if (logEntry.portion) {
			return (logEntry.multiplier * logEntry.portion.macros.protein);
		} else {
			return (logEntry.multiplier * logEntry.food.protein);
		}
	}

	private calculateFat(logEntry) {
		if (logEntry.portion) {
			return (logEntry.multiplier * logEntry.portion.macros.fat);
		} else {
			return (logEntry.multiplier * logEntry.food.fat);
		}
	}

	private calculateCarbs(logEntry) {
		if (logEntry.portion) {
			return (logEntry.multiplier * logEntry.portion.macros.carbs);
		} else {
			return (logEntry.multiplier * logEntry.food.carbs);
		}
	}

	public deleteLogEntry(logEntry: LogEntry) {
		const index: number = this.logEntries.indexOf(logEntry);
		if (index !== -1) {
			this.logEntries.splice(index, 1);
		}
		this.logService.deleteLogEntry(logEntry);
	}

	public saveAndClose() {
		this.close();
		const allEntries = [];
		for (const logEntry of this.logEntries) {
			const newRequest = new StoreLogRequest();
			newRequest.id = logEntry.id;
			newRequest.foodId = logEntry.food.id;
			if (logEntry.portion) {
				newRequest.portionId = logEntry.portion.id;
			}
			newRequest.multiplier = logEntry.multiplier;
			newRequest.day = this.pipe.transform(logEntry.day, 'yyyy-MM-dd');
			newRequest.meal = this.meal.toUpperCase();
			allEntries.push(newRequest);
		}
		const closeCallBack = () => {
			this.dataChanged.emit(true);
		};
		this.logService.storeLogEntries(allEntries, closeCallBack);
	}
}

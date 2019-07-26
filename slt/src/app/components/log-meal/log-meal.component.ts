import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LogEntry } from '../../model/logEntry';
import { StoreLogRequest } from '../../model/storeLogRequest';
import { DiaryService } from '../../services/diary.service';
import { FoodSearchable } from '../../model/foodSearchable';
import { ToastService } from '../../services/toast.service';
import { Portion } from '@app/model/portion';

@Component({
	selector: 'log-meal',
	templateUrl: './log-meal.component.html'
})
export class LogMealComponent implements OnInit, OnChanges {

	@ViewChild('logMeal', { static: false }) private logMealEref: ElementRef;

	@Input() searchables: FoodSearchable[];
	@Input() meal: string;
	@Input() logEntries: LogEntry[];
	@Input() date: Date;
	@Input() open: boolean;

	@Output() dataChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

	public editable: boolean;
	public addLogEntryCallBack: Function;

	public unitGrams = 100.00;
	public unitName = 'grams';

	private pipe: DatePipe;

	constructor(private diaryService: DiaryService,
		private toastService: ToastService) {
		this.editable = false;
		this.pipe = new DatePipe('en-US');
	}

	ngOnInit() {
		this.addLogEntryCallBack = this.addLogEntry.bind(this);
	}

	ngOnChanges(changes: SimpleChanges) {
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

	public setLogEntryMultiplier(event: any, logEntry: LogEntry) {
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

	public getAmountValue(logEntry: LogEntry) {
		if (logEntry.portion === undefined) {
			return (logEntry.multiplier * this.unitGrams);
		} else {
			return logEntry.multiplier;
		}
	}

	public isGramsSelected(logEntry: LogEntry) {
		if (logEntry.id === undefined) {
			return 'selected';
		} else if (logEntry.portion === undefined){
			return 'selected';
		} else {
			return '';
		}
	}

	public isUnitSelected(logEntry: LogEntry, portion: Portion) {
		if (logEntry.portion !== undefined && logEntry.portion.description === portion.description) {
			return 'selected'
		} else {
			return '';
		}
	}

	public copyPrevious() {
		const prevDay = new Date(this.date.getTime());
		prevDay.setDate(prevDay.getDate() - 1);
		const copyFrom = this.pipe.transform(prevDay, 'yyyy-MM-dd');
		this.toastService.setMessage(this.meal + ' has been copied from ' + copyFrom);

		for (const oldEntry of this.logEntries) {
			this.diaryService.deleteLogEntry(oldEntry);
			this.updateCalculatedMacros(oldEntry);
		}

		this.diaryService.getLogsForDay(copyFrom).subscribe(
			data => {
				const tmpData = data;
				const filtered = tmpData.filter(
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

	public amountChange(logEntry: LogEntry) {
		this.updateCalculatedMacros(logEntry);
	}

	public getAvailablePortions(logEntry: LogEntry) {
		for (const item of this.searchables) {
			if (item.food.id === logEntry.food.id) {
				return item.food.portions;
			}
		}
		return undefined;
	}

	public portionChange(logEntry: LogEntry, eventTarget) {
		if (eventTarget.value === this.unitName) {
			logEntry.portion = undefined;
		} else {
			for (const portion of logEntry.food.portions) {
				if (portion.description === eventTarget.value) {
					logEntry.portion = portion;
					break;
				}
			}
		}
		logEntry.multiplier = 1;
		this.updateCalculatedMacros(logEntry);
	}

	private updateCalculatedMacros(logEntry: LogEntry) {
		const protein = this.calculateProtein(logEntry);
		const carbs = this.calculateCarbs(logEntry);
		const fat = this.calculateFat(logEntry);
		const calories = (protein * 4) + (fat * 9) + (carbs * 4);
		logEntry.macrosCalculated = { protein: protein, fat: fat, carbs: carbs, calories: calories };
	}

	public addLogEntry(foodSearchable: FoodSearchable) {
		const food = foodSearchable.food;
		const dish = foodSearchable.dish;
		if (food !== undefined) {
			const logEntry = new LogEntry();
			logEntry.meal = this.meal.toUpperCase();
			logEntry.food = food;
			this.updateCalculatedMacros(logEntry);
			logEntry.day = this.date;
			this.logEntries.push(logEntry);
			console.log(this.logEntries);
		} else if (dish !== undefined) {
			// TODO: dish functions
		}
	}

	private calculateProtein(logEntry: LogEntry) {
		if (logEntry.portion !== undefined) {
			return (logEntry.multiplier * logEntry.portion.macros.protein);
		} else {
			return (logEntry.multiplier * logEntry.food.protein);
		}
	}

	private calculateFat(logEntry: LogEntry) {
		if (logEntry.portion) {
			return (logEntry.multiplier * logEntry.portion.macros.fat);
		} else {
			return (logEntry.multiplier * logEntry.food.fat);
		}
	}

	private calculateCarbs(logEntry: LogEntry) {
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
		this.diaryService.deleteLogEntry(logEntry);
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
		this.diaryService.storeLogEntries(allEntries, closeCallBack);
	}
}

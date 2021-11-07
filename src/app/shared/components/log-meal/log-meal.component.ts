import {
  Component,
  OnChanges,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Entry } from '../../model/entry';
import { StoreLogRequest } from '../../model/storeLogRequest';
import { DiaryService } from '../../services/diary.service';
import { FoodSearchable } from '../../model/foodSearchable';
import { ToastService } from '../../services/toast.service';
import { Portion } from 'src/app/shared/model/portion';

@Component({
  selector: 'log-meal',
  templateUrl: './log-meal.component.html',
  styleUrls: ['./log-meal.component.scss'],
})
export class LogMealComponent implements OnChanges {
  @ViewChild('logMeal', { static: false }) private logMealEref: ElementRef;

  @Input() meal: string;
  @Input() logEntries: Entry[];
  @Input() date: Date;
  @Input() open: boolean;
  @Input() dummy = false;

  @Output() dataChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  public editable: boolean;
  public unitGrams = 100.0;
  public unitName = 'grams';
  private pipe: DatePipe;

  constructor(private readonly diaryService: DiaryService, private readonly toastService: ToastService) {
    this.editable = false;
    this.pipe = new DatePipe('en-US');
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

  public setLogEntryMultiplier(event: any, logEntry: Entry) {
    if (event.data === '.') {
      return logEntry.multiplier;
    }
    if (!logEntry.portion) {
      logEntry.multiplier = event.target.value / this.unitGrams;
    } else {
      logEntry.multiplier = event.target.value;
    }
    return logEntry.multiplier;
  }

  public getAmountValue(logEntry: Entry) {
    if (logEntry.portion) {
      return logEntry.multiplier;
    } else {
      return logEntry.multiplier * 100;
    }
  }

  public isGramsSelected(logEntry: Entry) {
    if (logEntry.portion === undefined) {
      return true;
    } else {
      return false;
    }
  }

  public isUnitSelected(logEntry: Entry, portion: Portion) {
    if (
      logEntry.portion !== undefined &&
      logEntry.portion.description === portion.description
    ) {
      return true;
    } else {
      return false;
    }
  }

  public copyPrevious() {
    if (!this.dummy) {
      const prevDay = new Date(this.date.getTime());
      prevDay.setDate(prevDay.getDate() - 1);
      const copyFrom = this.pipe.transform(prevDay, 'yyyy-MM-dd');

      this.diaryService.getLogsForDate(copyFrom).subscribe(
        (data) => {
          const yesterdaysEntries = data;
          const filteredEntries = yesterdaysEntries.filter((entry) => entry.meal === this.meal.toUpperCase());
          for (const entry of filteredEntries) {
            const copiedEntry: Entry = {
              ...entry,
              day: this.date
            }
            this.setMacrosCalculated(copiedEntry);
            this.logEntries.push(copiedEntry);
          }
        }
      );
    }
  }

  public amountChange(logEntry: Entry) {
    this.setMacrosCalculated(logEntry);
  }

  public getAvailablePortions(logEntry: Entry): Portion[] {
    return logEntry.food.portions;
  }

  public portionChange(logEntry: Entry, event: any) {
    if (event.target.value === this.unitName) {
      logEntry.portion = undefined;
      logEntry.multiplier = logEntry.multiplier / 100;
    } else {
      for (const portion of logEntry.food.portions) {
        if (portion.description === event.target.value) {
          if (logEntry.portion === undefined) {
            logEntry.multiplier = logEntry.multiplier * 100;
          }
          logEntry.portion = portion;
          break;
        }
      }
    }
    this.setMacrosCalculated(logEntry);
  }

  public addLogEntry(foodSearchable: FoodSearchable) {
    const food = foodSearchable.food;
    const dish = foodSearchable.dish;
    if (food !== undefined) {
      const logEntry: Entry = {};
      logEntry.meal = this.meal.toUpperCase();
      logEntry.food = food;
      if (food.portions) {
        logEntry.portion = food.portions[0];
        logEntry.multiplier = 1; // 1 * 1st selected portion
      } else {
        logEntry.multiplier = 1; // 1* 100 grams
      }
      this.setMacrosCalculated(logEntry);
      logEntry.day = this.date;
      this.logEntries.push(logEntry);
    } else {
      for (const ingredient of dish.ingredients) {
        const logEntry: Entry = {};
        logEntry.meal = this.meal.toUpperCase();
        logEntry.food = ingredient.food;
        logEntry.multiplier = ingredient.multiplier;
        if (ingredient.portionId) {
          for (const portion of ingredient.food.portions) {
            if (portion.id === ingredient.portionId) {
              logEntry.portion = portion;
              break;
            }
          }
        }
        this.setMacrosCalculated(logEntry);
        logEntry.day = this.date;
        this.logEntries.push(logEntry);
      }
    }
  }

  private setMacrosCalculated(logEntry: Entry) {
    const protein = this.multiplyMacro(logEntry, 'protein');
    const fat = this.multiplyMacro(logEntry, 'fat');
    const carbs = this.multiplyMacro(logEntry, 'carbs');
    const calories = protein * 4 + fat * 9 + carbs * 4;
    logEntry.macrosCalculated = {
      protein: protein,
      fat: fat,
      carbs: carbs,
      calories: calories,
    };
  }
  
  private multiplyMacro(logEntry: Entry, macro: 'protein' | 'fat' | 'carbs'): number {
    if (logEntry.portion) {
      return logEntry.multiplier * logEntry.portion.macros[macro];
    } else {
      return logEntry.multiplier * logEntry.food[macro];
    }
  }

  public deleteLogEntry(logEntry: Entry) {
    if (!this.dummy) {
      const index: number = this.logEntries.indexOf(logEntry);
      if (index !== -1) {
        this.logEntries.splice(index, 1);
      }
      this.diaryService.deleteEntry(logEntry).subscribe()
    }
  }

  public saveAndClose() {
    this.close();
    const allEntries = [];
    for (const logEntry of this.logEntries) {
      const newRequest: StoreLogRequest = {};
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
    if (!this.dummy) {
      this.diaryService.addEntries(allEntries).subscribe(it => {
        this.dataChanged.emit(true);
      });
    } 
  }
}

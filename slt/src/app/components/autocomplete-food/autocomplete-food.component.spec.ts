import { AutocompleteFoodComponent } from './autocomplete-food.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Food } from '@app/model/food';
import { Dish } from '@app/model/dish';

describe('AutocompleteFoodComponent', () => {
	let component: AutocompleteFoodComponent;
	let fixture: ComponentFixture<AutocompleteFoodComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AutocompleteFoodComponent],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AutocompleteFoodComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create autocomplete food component', () => {
		expect(component).toBeTruthy();
	});

	it('should call find food match on input and foodName to be set', () => {
		spyOn(component, 'findFoodMatch');
		const input = fixture.debugElement.query(By.css('#autoInput'));
		expect(input.nativeElement.value).toEqual('');
		input.nativeElement.value = 'A';
		input.nativeElement.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		expect(input.nativeElement.value).toEqual('A');
		expect(component.findFoodMatch).toHaveBeenCalled();
	});

	it('should find food match', () => {
		component.searchables = [
			{ food: new Food('Abc', 1, 2, 3), dish: undefined },
			{ food: new Food('Def', 1, 2, 3), dish: undefined }
		];
		component.foodName = 'A';
		expect(component.foodMatch).toEqual(new Array());
		component.findFoodMatch({ data: 'somedata' });
		let result = [{ food: new Food('Abc', 1, 2, 3), dish: undefined }];
		expect(component.foodMatch).toEqual(result);

		component.searchables = [
			{ food: new Food('Abc', 1, 2, 3), dish: undefined },
			{ food: new Food('Cde', 1, 2, 3), dish: undefined }
		];
		component.foodName = 'C';
		component.findFoodMatch({ data: 'somedata' });
		result = [{ food: new Food('Abc', 1, 2, 3), dish: undefined }, { food: new Food('Cde', 1, 2, 3), dish: undefined }];
		expect(component.foodMatch).toEqual(result);

		component.searchables = [
			{ food: new Food('Abc', 1, 2, 3), dish: undefined },
			{ food: new Food('Cde', 1, 2, 3), dish: undefined }
		];
		component.foodName = 'Aa';
		component.findFoodMatch({ data: 'somedata' });
		result = [];
		expect(component.foodMatch).toEqual(result);
	});

	it('should find dish match', () => {
		component.searchables = [
			{ food: undefined, dish: new Dish('Abc') },
			{ food: undefined, dish: new Dish('Def') }
		];
		component.foodName = 'A';
		expect(component.foodMatch).toEqual(new Array());
		component.findFoodMatch({ data: 'somedata' });
		let result = [{ food: undefined, dish: new Dish('Abc') }];
		expect(component.foodMatch).toEqual(result);

		component.searchables = [
			{ food: undefined, dish: new Dish('Abc') },
			{ food: undefined, dish: new Dish('Cde') }
		];
		component.foodName = 'C';
		component.findFoodMatch({ data: 'somedata' });
		result = [{ food: undefined, dish: new Dish('Abc') }, { food: undefined, dish: new Dish('Cde') }];
		expect(component.foodMatch).toEqual(result);

		component.searchables = [
			{ food: new Food('Abc', 1, 2, 3), dish: new Dish('Abc with def') },
			{ food: new Food('Cde', 1, 2, 3), dish: undefined },
		];
		component.foodName = 'c';
		component.findFoodMatch({ data: 'somedata' });
		result = [{ food: new Food('Abc', 1, 2, 3), dish: new Dish('Abc with def') }, { food: new Food('Cde', 1, 2, 3), dish: undefined },];
		expect(component.foodMatch).toEqual(result);
	});

	it('should show autocomplete dropdown on focus', () => {
		spyOn(component, 'getDescription');
		const input = fixture.debugElement.query(By.css('#autoInput'));
		input.nativeElement.dispatchEvent(new Event('focus'));
		component.foodMatch = [
			{ food: new Food('Abc', 1, 2, 3), dish: undefined },
			{ food: new Food('Cde', 1, 2, 3), dish: undefined }
		];
		fixture.detectChanges();
		let result = fixture.debugElement.query(By.css('#autoDropdown'));
		expect(result).not.toEqual(null);
		result = fixture.debugElement.query(By.css('#autoOption'));
		expect(result).not.toEqual(null);
		expect(component.getDescription).toHaveBeenCalled();
	});

	it('should handle click on autocomplete option', () => {
		component.selectFn = () => { };
		component.foodName = 'Test';
		component.showAutoComplete = true;
		spyOn(component, 'selectFn');
		component.showAutoComplete = true;
		component.foodMatch = [
			{ food: new Food('Abc', 1, 2, 3), dish: undefined },
			{ food: new Food('Cde', 1, 2, 3), dish: undefined }
		];
		fixture.detectChanges();
		const result = fixture.debugElement.query(By.css('#autoOption'));
		expect(result).not.toEqual(null);
		result.nativeElement.click();
		expect(component.selectFn).toHaveBeenCalled();
		expect(component.foodName).toEqual('');
		expect(component.showAutoComplete).toBeFalsy();
	});

	it('should get food or dish description', () => {
		const dish = new Dish('someDish');
		let result = component.getDescription({ food: undefined, dish: dish });
		expect(result).toEqual(dish.name + ' (dish)');

		const food = new Food('someFood', 1, 2, 3);
		result = component.getDescription({ food: food, dish: dish });
		expect(result).toEqual(dish.name + ' (dish)');

		result = component.getDescription({ food: food, dish: undefined });
		expect(result).toEqual(food.name);
	});

	it('should close dropdown when clicking somewhere on the page', () => {
		component.showAutoComplete = true;
		document.dispatchEvent(new MouseEvent('click'));
		expect(component.showAutoComplete).toBe(false);
	});

	it('should focus autocompete options on keydown', () => {
		spyOn(component, 'onKeyDown');
		component.showAutoComplete = true;
		component.foodMatch = [
			{ food: new Food('Abc', 1, 2, 3), dish: undefined },
			{ food: new Food('Cde', 1, 2, 3), dish: undefined }
		];
		fixture.detectChanges();
		const wrapper = fixture.debugElement.query(By.css('#autoWrapper'));
		wrapper.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
		fixture.detectChanges();
		expect(component.onKeyDown).toHaveBeenCalled();
	});

	it('should select first option on keydown', () => {
		spyOn(component, 'handleInputKeydown');
		spyOn(component, 'handleOptionKeydown');
		spyOn(component, 'handleOptionKeyup');
		component.showAutoComplete = true;
		component.foodMatch = [
			{ food: new Food('Abc', 1, 2, 3), dish: undefined },
			{ food: new Food('Cde', 1, 2, 3), dish: undefined }
		];
		fixture.detectChanges();
		const input = fixture.debugElement.query(By.css('#autoInput'));
		input.nativeElement.focus();
		component.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
		expect(component.handleInputKeydown).toHaveBeenCalled();
		const wrapper = fixture.debugElement.query(By.css('#autoWrapper'));

		wrapper.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
		fixture.detectChanges();
		expect(component.handleOptionKeydown).not.toHaveBeenCalled();
		expect(component.handleOptionKeydown).not.toHaveBeenCalled();
	});

	it('should select next portion on keydown', () => {
		spyOn(component, 'handleOptionKeydown');
		spyOn(component, 'handleOptionKeyup');
		component.showAutoComplete = true;
		component.foodMatch = [
			{ food: new Food('Abc', 1, 2, 3), dish: undefined },
			{ food: new Food('Cde', 1, 2, 3), dish: undefined }
		];
		fixture.detectChanges();
		const input = fixture.debugElement.query(By.css('#autoInput'));
		input.nativeElement.focus();
		component.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
		fixture.detectChanges();

		const wrapper = fixture.debugElement.query(By.css('#autoWrapper'));
		wrapper.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
		fixture.detectChanges();
		expect(component.handleOptionKeydown).toHaveBeenCalled();

		wrapper.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
		fixture.detectChanges();
		expect(component.handleOptionKeydown).toHaveBeenCalled();
	});

	it('should handle input keydown', () => {
		let result = false;
		let event = {
			key: 'ArrowDown', preventDefault: () => {
				result = true;
			}
		};
		const lastNode = {
			localName: 'div', focus: () => {
				result = true;
			}
		};
		const nodelist = [{ localName: 'notDiv' }, lastNode];
		component.handleInputKeydown(event, nodelist);
		expect(result).toBeTruthy();

		event = {
			key: 'Enter', preventDefault: () => {
				result = false;
			}
		};
		component.handleInputKeydown(event, nodelist);
		expect(result).toBeTruthy();
	});

	it('should select first option on keydown', () => {
		component.showAutoComplete = true;
		component.foodMatch = [
			{ food: new Food('Abc', 1, 2, 3), dish: undefined },
			{ food: new Food('Cde', 1, 2, 3), dish: undefined }
		];
		fixture.detectChanges();
		const input = fixture.debugElement.query(By.css('#autoInput'));
		input.nativeElement.focus();
		component.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
		expect(document.activeElement.className).toEqual('autocomplete__option option-0');
		component.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
		expect(document.activeElement.className).toEqual('autocomplete__option option-1');
		component.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
		expect(document.activeElement.className).toEqual('autocomplete__option option-0');
	});
});

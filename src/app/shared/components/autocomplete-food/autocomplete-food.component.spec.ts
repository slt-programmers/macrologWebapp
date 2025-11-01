import { AutocompleteFoodComponent } from './autocomplete-food.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Dish } from 'src/app/shared/model/dish';
import { Food } from 'src/app/shared/model/food';
import { FormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { selectAllFood } from '../../store/selectors/food.selectors';
import { selectAllDishes } from '../../store/selectors/dishes.selectors';

describe('AutocompleteFoodComponent', () => {
  let component: AutocompleteFoodComponent;
  let fixture: ComponentFixture<AutocompleteFoodComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [FormsModule, AutocompleteFoodComponent],
    providers: [
        provideMockStore({
            selectors: [
                {
                    selector: selectAllFood, value: [
                        { id: 1, name: 'food1', protein: 1, fat: 2, carbs: 3 },
                        { id: 2, name: 'food2', protein: 4, fat: 5, carbs: 6 }
                    ]
                }, {
                    selector: selectAllDishes, value: [
                        {
                            name: 'dish1', ingredients: [
                                { food: { id: 1, name: 'food1', protein: 1, fat: 2, carbs: 3 } },
                                { food: { id: 2, name: 'food2', protein: 4, fat: 5, carbs: 6 } },
                            ]
                        }
                    ]
                }
            ]
        }),
    ]
}).compileComponents();

    fixture = TestBed.createComponent(AutocompleteFoodComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should find food match', () => {
    component.searchables = [
      { food: { name: 'Abc', protein: 1, fat: 2, carbs: 3 }, dish: undefined },
      { food: { name: 'Def', protein: 1, fat: 2, carbs: 3 }, dish: undefined },
    ];
    component.foodName = 'A';
    expect(component.foodMatch).toEqual(new Array());
    component.findFoodMatch({ data: 'somedata' });
    let result = [{ food: { name: 'Abc', protein: 1, fat: 2, carbs: 3 }, dish: undefined as Dish }];
    expect(component.foodMatch).toEqual(result);

    component.searchables = [
      { food: { name: 'Abc', protein: 1, fat: 2, carbs: 3 }, dish: undefined },
      { food: { name: 'Cde', protein: 1, fat: 2, carbs: 3 }, dish: undefined },
    ];
    component.foodName = 'C';
    component.findFoodMatch({ data: 'somedata' });
    result = [
      { food: { name: 'Abc', protein: 1, fat: 2, carbs: 3 }, dish: undefined },
      { food: { name: 'Cde', protein: 1, fat: 2, carbs: 3 }, dish: undefined },
    ];
    expect(component.foodMatch).toEqual(result);

    component.searchables = [
      { food: { name: 'Abc', protein: 1, fat: 2, carbs: 3 }, dish: undefined },
      { food: { name: 'Cde', protein: 1, fat: 2, carbs: 3 }, dish: undefined },
    ];
    component.foodName = 'Aa';
    component.findFoodMatch({ data: 'somedata' });
    result = [];
    expect(component.foodMatch).toEqual(result);

    component.findFoodMatch({ data: null });
    expect(component.foodMatch).toEqual(result);
  });

  it('should find dish match', () => {
    component.searchables = [
      { food: undefined, dish: { name: 'Abc' } },
      { food: undefined, dish: { name: 'Def' } },
    ];
    component.foodName = 'A';
    expect(component.foodMatch).toEqual(new Array());
    component.findFoodMatch({ data: 'somedata' });
    let result = [{ food: undefined as Food, dish: { name: 'Abc' } }];
    expect(component.foodMatch).toEqual(result);

    component.searchables = [
      { food: undefined, dish: { name: 'Abc' } },
      { food: undefined, dish: { name: 'Cde' } },
    ];
    component.foodName = 'C';
    component.findFoodMatch({ data: 'somedata' });
    result = [
      { food: undefined, dish: { name: 'Abc' } },
      { food: undefined, dish: { name: 'Cde' } },
    ];
    expect(component.foodMatch).toEqual(result);

    component.searchables = [
      { food: { name: 'Abc', protein: 1, fat: 2, carbs: 3 }, dish: { name: 'Abc with Def' } },
      { food: { name: 'Cde', protein: 1, fat: 2, carbs: 3 }, dish: undefined },
    ];
    component.foodName = 'c';
    component.findFoodMatch({ data: 'somedata' });
    result = [
      { food: { name: 'Abc', protein: 1, fat: 2, carbs: 3 }, dish: { name: 'Abc with Def' } },
      { food: { name: 'Cde', protein: 1, fat: 2, carbs: 3 }, dish: undefined },
    ];
    expect(component.foodMatch).toEqual(result);
  });

  it('should show autocomplete dropdown on focus', () => {
    spyOn(component, 'getDescription');
    const input = fixture.debugElement.query(By.css('#autoInput'));
    input.nativeElement.dispatchEvent(new Event('focus'));
    component.foodMatch = [
      { food: { name: 'Abc', protein: 1, fat: 2, carbs: 3 }, dish: undefined },
      { food: { name: 'Cde', protein: 1, fat: 2, carbs: 3 }, dish: undefined },
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
      { food: { name: 'Abc', protein: 1, fat: 2, carbs: 3 }, dish: undefined },
      { food: { name: 'Cde', protein: 1, fat: 2, carbs: 3 }, dish: undefined },
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
    const dish = { name: 'Somedish' };
    let result = component.getDescription({ food: undefined, dish: dish });
    expect(result).toEqual(dish.name + ' (dish)');

    const food = { name: 'Somefood', protein: 1, fat: 2, carbs: 3 };
    result = component.getDescription({ food: food, dish: dish });
    expect(result).toEqual(dish.name + ' (dish)');

    result = component.getDescription({ food: food, dish: undefined });
    expect(result).toEqual(food.name);
  });

  it('should focus autocompete options on keydown', () => {
    spyOn(component, 'onKeyDown');
    component.showAutoComplete = true;
    component.foodMatch = [
      { food: { name: 'Abc', protein: 1, fat: 2, carbs: 3 }, dish: undefined },
      { food: { name: 'Cde', protein: 1, fat: 2, carbs: 3 }, dish: undefined },
    ];
    fixture.detectChanges();
    const wrapper = fixture.debugElement.query(By.css('#autoWrapper'));
    wrapper.nativeElement.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown' })
    );
    fixture.detectChanges();
    expect(component.onKeyDown).toHaveBeenCalled();
  });

  // it('should select other options on keydown', () => {
  //   spyOn(component, 'handleArrowDown');
  //   spyOn(component, 'handleArrowUp');
  //   spyOn(component, 'handleOptionKeyup');
  //   component.showAutoComplete = true;
  //   component.foodMatch = [
  //     { food: { name: 'Abc', protein: 1, fat: 2, carbs: 3 }, dish: undefined },
  //     { food: { name: 'Cde', protein: 1, fat: 2, carbs: 3 }, dish: undefined },
  //   ];
  //   fixture.detectChanges();

  //   const input = fixture.debugElement.query(By.css('#autoInput'));
  //   input.nativeElement.focus();
  //   component.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
  //   expect(component.handleArrowDown).toHaveBeenCalled();

  //   const option = fixture.debugElement.query(By.css('#autoOption'));
  //   option.nativeElement.focus();
  //   component.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
  //   expect(component.handleOptionKeydown).toHaveBeenCalled();

  //   option.nativeElement.focus();
  //   component.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
  //   expect(component.handleOptionKeyup).toHaveBeenCalled();
  // });

  // it('should not select other options on different keys or elements', () => {
  //   spyOn(component, 'handleInputKeydown');
  //   spyOn(component, 'handleOptionKeydown');
  //   spyOn(component, 'handleOptionKeyup');
  //   component.showAutoComplete = true;
  //   component.foodMatch = [
  //     { food: { name: 'Abc', protein: 1, fat: 2, carbs: 3 }, dish: undefined },
  //     { food: { name: 'Cde', protein: 1, fat: 2, carbs: 3 }, dish: undefined },
  //   ];
  //   fixture.detectChanges();
  //   component.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
  //   expect(component.handleArrowDown).not.toHaveBeenCalled();

  //   const option = fixture.debugElement.query(By.css('#autoOption'));
  //   option.nativeElement.focus();
  //   component.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
  //   expect(component.handleOptionKeyup).not.toHaveBeenCalled();
  //   expect(component.handleOptionKeydown).not.toHaveBeenCalled();

  //   const wrapper = fixture.debugElement.query(By.css('#autoWrapper'));
  //   wrapper.nativeElement.dispatchEvent(
  //     new KeyboardEvent('keydown', { key: 'Enter' })
  //   );
  //   fixture.detectChanges();
  //   expect(component.handleInputKeydown).not.toHaveBeenCalled();
  // });

  // it('should select next portion on keydown', () => {
  //   spyOn(component, 'handleOptionKeydown');
  //   spyOn(component, 'handleOptionKeyup');
  //   component.showAutoComplete = true;
  //   component.foodMatch = [
  //     { food: { name: 'Abc', protein: 1, fat: 2, carbs: 3 }, dish: undefined },
  //     { food: { name: 'Cde', protein: 1, fat: 2, carbs: 3 }, dish: undefined },
  //   ];
  //   fixture.detectChanges();
  //   const input = fixture.debugElement.query(By.css('#autoInput'));
  //   input.nativeElement.focus();
  //   component.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
  //   fixture.detectChanges();

  //   const wrapper = fixture.debugElement.query(By.css('#autoWrapper'));
  //   wrapper.nativeElement.dispatchEvent(
  //     new KeyboardEvent('keydown', { key: 'ArrowDown' })
  //   );
  //   fixture.detectChanges();
  //   expect(component.handleOptionKeydown).toHaveBeenCalled();

  //   wrapper.nativeElement.dispatchEvent(
  //     new KeyboardEvent('keydown', { key: 'ArrowUp' })
  //   );
  //   fixture.detectChanges();
  //   expect(component.handleOptionKeydown).toHaveBeenCalled();
  // });

  // it('should handle input keydown', () => {
  //   let result = false;
  //   let event = {
  //     key: 'ArrowDown',
  //     preventDefault: () => {
  //       result = true;
  //     },
  //   };
  //   const lastNode = {
  //     localName: 'div',
  //     focus: () => {
  //       result = true;
  //     },
  //   };
  //   const nodelist = [{ localName: 'notDiv' }, lastNode];
  //   component.handleInputKeydown(event, nodelist);
  //   expect(result).toBeTruthy();

  //   event = {
  //     key: 'Enter',
  //     preventDefault: () => {
  //       result = false;
  //     },
  //   };
  //   component.handleInputKeydown(event, nodelist);
  //   expect(result).toBeTruthy();
  // });

  it('should select options but not unfocus on last or first element', () => {
    component.showAutoComplete = true;
    component.foodMatch = [
      { food: { name: 'Abc', protein: 1, fat: 2, carbs: 3 }, dish: undefined },
      { food: { name: 'Cde', protein: 1, fat: 2, carbs: 3 }, dish: undefined },
    ];
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('#autoInput'));
    input.nativeElement.focus();
    component.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(document.activeElement.className).toEqual(
      'autocomplete__option option-0'
    );
    component.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    expect(document.activeElement.className).toEqual(
      'input autocomplete__input ng-untouched ng-pristine ng-valid'
    );
    component.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(document.activeElement.className).toEqual(
      'autocomplete__option option-0'
    );
    component.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(document.activeElement.className).toEqual(
      'autocomplete__option option-1'
    );
    component.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(document.activeElement.className).toEqual(
      'autocomplete__option option-1'
    );
    component.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    expect(document.activeElement.className).toEqual(
      'autocomplete__option option-0'
    );
  });
});

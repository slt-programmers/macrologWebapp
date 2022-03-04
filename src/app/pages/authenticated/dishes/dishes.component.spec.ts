// import { ComponentFixture, TestBed } from "@angular/core/testing"
// import { MockProvider } from "ng-mocks"
// import { of } from "rxjs";
// import { Ingredient } from "src/app/shared/model/ingredient";
// import { Portion } from "src/app/shared/model/portion";
// import { DishesComponent } from "./dishes.component"
// import { MockStore, provideMockStore } from "@ngrx/store/testing"
// import { selectAllDishes } from 'src/app/shared/store/selectors/dishes.selectors';
//
// describe('DishesComponent', () => {
//   let fixture: ComponentFixture<DishesComponent>;
//   let component: DishesComponent;
//   let store: MockStore;
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         DishesComponent
//       ],
//       providers: [
// 				provideMockStore({selectors:[{selector:selectAllDishes,value:[{ name: 'dish2' }, { name: 'dish1' }]}]})
//       ]
//     }).compileComponents();
//
// 		store = TestBed.inject(MockStore);
//     fixture = TestBed.createComponent(DishesComponent);
//     component = fixture.componentInstance;
//   });
//
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
//
//   it('should init component', () => {
//     component.ngOnInit();
//     expect(component.allDishes).toEqual([{ name: 'dish1' }, { name: 'dish2' }]);
//   });
//
//   it('should open and close modal', () => {
//     component.openModal(null);
//     expect(component.modalIsVisible).toBeTrue();
//     component.closeModal();
//     expect(component.modalIsVisible).toBeFalse();
//     component.openModal({
//       id: 1,
//       name: 'dish',
//       ingredients: [{
//         food: {
//           id: 1, name: 'name', protein: 1, fat: 2, carbs: 3,
//           portions: [{ id: 1, description: 'desc', grams: 50 }]
//         }
//       }]
//     });
//     expect(component.modalTitle).toEqual('Edit dish');
//     expect(component.selectedDish).toEqual({
//       id: 1,
//       name: 'dish',
//       ingredients: [{
//         food: {
//           id: 1, name: 'name', protein: 1, fat: 2, carbs: 3, portions: [{ id: 1, description: 'desc', grams: 50 }]
//         },
//         portion: { id: 1, description: 'desc', grams: 50 },
//       }]
//     });
//   });
//
//   it('should get portion', () => {
//     const ingredient: Ingredient = { food: { portions: [{ id: 1 }] } }
//     let result = component.getPortion(ingredient, 1);
//     expect(result).toEqual({ id: 1 });
//     result = component.getPortion(ingredient, 2);
//     expect(result).toEqual({});
//   });
//
//   it('should get description', () => {
//     const ingredient: Ingredient = {
//       portion: { id: 1, description: 'portionDesc' },
//       multiplier: 1,
//       food: {
//         portions: [
//           { id: 1, description: 'portionDesc' }]
//       }
//     };
//     let result = component.getIngredientDescription(ingredient);
//     expect(result).toEqual('1 portionDesc');
//     ingredient.portion = undefined;
//     result = component.getIngredientDescription(ingredient);
//     expect(result).toEqual('100 gram');
//   });
//
//   it('should get total', () => {
//     const result = component.getTotal({ macrosCalculated: 123 });
//     expect(result).toEqual(123);
//   });
//
//   it('should add ingredient', () => {
//     component.selectedDish = { name: 'name', ingredients: [] };
//     component.addIngredient({ food: { id: 1, name: 'food', protein: 1, fat: 2, carbs: 3 } });
//     expect(component.selectedDish).toEqual({
//       name: 'name',
//       ingredients: [{
//         multiplier: 1,
//         food: { id: 1, name: 'food', protein: 1, fat: 2, carbs: 3 }
//       }]
//     });
//   });
//
//   it('should save dish', () => {
//     spyOn(component, 'closeModal');
//     const dish = {
//       name: 'dish', ingredients: [{
//         multiplier: 1,
//         food: { id: 1, name: 'food', protein: 1, fat: 2, carbs: 3 }
//       }]
//     }
//     component.selectedDish = dish
//     component.saveDish();
//     expect(component.closeModal).toHaveBeenCalled();
//   });
//
//   it('should remove ingredient', () => {
//     component.selectedDish = {
//       name: 'dish', ingredients: [{
//         multiplier: 1,
//         food: { id: 1, name: 'food', protein: 1, fat: 2, carbs: 3 }
//       }]
//     }
//     component.removeIngredient(0);
//     expect(component.selectedDish).toEqual({ name: 'dish', ingredients: [] });
//   });
//
//   it('should change portion of food in dish', () => {
//     const ingredient = {
//       multiplier: 2,
//       food: {
//         id: 1, name: 'food', protein: 1, fat: 2, carbs: 3, portions: [
//           { id: 1, description: 'portion2', grams: 150 },
//           { id: 1, description: 'portion', grams: 50 },
//         ] as Portion[]
//       },
//       portion: { id: 1, description: 'portion', grams: 50 },
//       portionId: 1
//     }
//     component.portionChange(ingredient, { value: 'grams' });
//     expect(ingredient.portion).toBeUndefined();
//     expect(ingredient.portionId).toBeUndefined();
//     expect(ingredient.multiplier).toEqual(1);
//
//     component.portionChange(ingredient, { value: 'portion' });
//     expect(ingredient.portion).toEqual({ id: 1, description: 'portion', grams: 50 });
//     expect(ingredient.portionId).toEqual(1);
//   });
//
//   it('should get step for portion input', () => {
//     const ingredient = {
//       multiplier: 2,
//       food: {
//         id: 1, name: 'food', protein: 1, fat: 2, carbs: 3, portions: [
//           { id: 1, description: 'portion', grams: 50 }
//         ] as Portion[]
//       },
//       portion: { id: 1, description: 'portion', grams: 50 },
//       portionId: 1
//     }
//     let result = component.getStep(ingredient);
//     expect(result).toEqual(0.1);
//     ingredient.portion = undefined
//     result = component.getStep(ingredient);
//     expect(result).toEqual(1);
//   });
//
//   it('should calculate multiplier', () => {
//     const ingredient = {
//       multiplier: 1,
//       food: {
//         id: 1, name: 'food', protein: 1, fat: 2, carbs: 3, portions: [
//           { id: 1, description: 'portion', grams: 50 }
//         ] as Portion[]
//       },
//       portion: { id: 1, description: 'portion', grams: 50 },
//       portionId: 1
//     }
//     component.calculateMultiplier({ target: { value: 2 } }, ingredient);
//     expect(ingredient.multiplier).toEqual(2);
//     ingredient.portion = undefined;
//     component.calculateMultiplier({ target: { value: 200 } }, ingredient);
//     expect(ingredient.multiplier).toEqual(2);
//   });
//
//   it('should get value', () => {
//     const ingredient = {
//       multiplier: 2,
//       food: {
//         id: 1, name: 'food', protein: 1, fat: 2, carbs: 3, portions: [
//           { id: 1, description: 'portion', grams: 50 }
//         ] as Portion[]
//       },
//       portion: { id: 1, description: 'portion', grams: 50 },
//       portionId: 1
//     }
//     let result = component.getValue(ingredient);
//     expect(result).toEqual(2);
//     ingredient.portion = undefined;
//     result = component.getValue(ingredient);
//     expect(result).toEqual(200);
//   });
//
//   it('should delete dish', () => {
//     spyOn(component, 'closeModal');
//     const dish = {
//       name: 'dish',
//       ingredients: [{ food: { id: 1, name: 'food', protein: 1, fat: 2, carbs: 3 } }]
//     };
//     component.selectedDish = dish;
//     component.deleteDish();
//     expect(component.closeModal).toHaveBeenCalled();
//   });
//
// });

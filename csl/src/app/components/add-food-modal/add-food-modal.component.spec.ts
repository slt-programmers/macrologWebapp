import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFoodModalComponent } from './add-food-modal.component';

describe('AddFoodModalComponent', () => {
  let component: AddFoodModalComponent;
  let fixture: ComponentFixture<AddFoodModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFoodModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFoodModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

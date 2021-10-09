import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA,
  Renderer2,
  Type,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { MakeDishModalComponent } from './make-dish-modal.component';
import { DishService } from 'src/app/shared/services/dish.service';
import { FoodService } from 'src/app/shared/services/food.service';
import { ScrollBehaviourService } from 'src/app/shared/services/scroll-behaviour.service';
import { ToastService } from 'src/app/shared/services/toast.service';

describe('MakeDishModalComponent', () => {
  let component: MakeDishModalComponent;
  let fixture: ComponentFixture<MakeDishModalComponent>;
  let foodService: FoodService;
  let scrollBehaviourService: ScrollBehaviourService;
  let renderer2: Renderer2;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MakeDishModalComponent],
      providers: [
        ScrollBehaviourService,
        DishService,
        FoodService,
        HttpClient,
        HttpHandler,
        ToastService,
        Renderer2,
      ],
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(MakeDishModalComponent);
    component = fixture.componentInstance;
    foodService = TestBed.inject(FoodService);
    scrollBehaviourService = TestBed.inject(ScrollBehaviourService);
    renderer2 = fixture.componentRef.injector.get<Renderer2>(
      Renderer2 as Type<Renderer2>
    );
    scrollBehaviourService.setRenderer(renderer2);
    fixture.detectChanges();
  });

  // it('should create add food modal', () => {
  // 	spyOn(scrollBehaviourService, 'preventScrolling');
  // 	expect(component).toBeTruthy();
  // });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculateIntakeModalComponent } from './calculate-intake-modal.component';
import { ScrollBehaviourService } from '@app/services/scroll-behaviour.service';
import { FoodService } from '@app/services/food.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ToastService } from '@app/services/toast.service';
import { Renderer2, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

describe('CalculateIntakeModalComponent', () => {
  let component: CalculateIntakeModalComponent;
  let fixture: ComponentFixture<CalculateIntakeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculateIntakeModalComponent ],
			providers: [ScrollBehaviourService, FoodService, HttpClient, HttpHandler, ToastService, Renderer2],
			imports: [FormsModule],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculateIntakeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create calculate-intake-modal', () => {
  //   expect(component).toBeTruthy();
  // });
});

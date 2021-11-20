import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SliderComponent } from './slider.component';

describe('SliderComponent', () => {
  let component: SliderComponent;
  let fixture: ComponentFixture<SliderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SliderComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(SliderComponent);
    component = fixture.componentInstance;
    component.markers = [{value: 1000}, {value: 2000}, {value: 3000}];
    component.value = 2000;
    component.sliderElement = {nativeElement: {style: {}}}
    component.handleElement = {nativeElement: {style: {}}}
    component.trackElement = {nativeElement: {style: {}}}
    component.lowerMarkElement = {nativeElement: {style: {}}}
    component.baseMarkElement = {nativeElement: {style: {}}}
    component.upperMarkElement = {nativeElement: {style: {}}}
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngAfterViewInit();
    expect(component).toBeTruthy();
  });

});

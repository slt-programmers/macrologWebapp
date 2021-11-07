import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Renderer2 } from '@angular/core';
import { ToastComponent } from './toast.component';
import { MockProvider } from 'ng-mocks';
import { ToastService } from '../../services/toast.service';
import { of } from 'rxjs';


class MockRenderer {
  public setStyle(a: any, b: any, c: any) {

  }
}

describe('StepperComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToastComponent],
      providers: [
        ToastService,
        MockProvider(Renderer2)
      ]
    }).compileComponents();

    service = TestBed.inject(ToastService);
    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set toast fields', () => {
    service.setMessage('test', true, 'title');
    expect(component.isError).toBeTrue();
    expect(component.message).toEqual('test');
    expect(component.title).toEqual('title');
  });

  it('should close toast', () => {
    component.closeToast();
    expect(component.title).toEqual('')
    expect(component.message).toEqual('')
    expect(component.isError).toEqual(false)
  });
});

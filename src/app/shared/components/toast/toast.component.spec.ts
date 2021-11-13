import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { MockProvider } from 'ng-mocks';
import { ToastService } from '../../services/toast.service';
import { of } from 'rxjs';
import { Toast } from '../../model/toast';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToastComponent],
      providers: [
        MockProvider(ToastService)
      ]
    }).compileComponents();

    service = TestBed.inject(ToastService);
    service.messageObservable = of({title: 'title', message: 'message', isError: true} as Toast);

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set toast fields', () => {
    expect(component.toasts).toEqual([{title: 'title', message: 'message', isError: true} as Toast]);
  });

  it('should close toast', () => {
    expect(component.toasts.length).toEqual(1);
    component.closeToast(0);
    expect(component.toasts.length).toEqual(0);
  });
});

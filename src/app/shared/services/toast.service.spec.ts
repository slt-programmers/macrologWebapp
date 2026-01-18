import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService],
    });
    service = TestBed.inject(ToastService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should check state', (done) => {
    const result = service.messageObservable
    result.subscribe(it => {
      expect(it).toEqual({ message: 'test', isError: true, title: "testtest" });
      done();
    })
    service.setMessage('test', true, "testtest");
  });
});

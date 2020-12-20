import { TestBed } from '@angular/core/testing';
import { WeightService } from './weight.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastService } from './toast.service';

describe('WeightService', () => {
  let service: WeightService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeightService, ToastService],
    });
    service = TestBed.inject(WeightService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });
});

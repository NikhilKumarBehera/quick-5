import { TestBed } from '@angular/core/testing';

import { CategoryProgressService } from './category-progress-service';

describe('CategoryProgressService', () => {
  let service: CategoryProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NumberTapPage } from './number-tap.page';

describe('NumberTapPage', () => {
  let component: NumberTapPage;
  let fixture: ComponentFixture<NumberTapPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberTapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

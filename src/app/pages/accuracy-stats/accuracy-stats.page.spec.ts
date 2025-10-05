import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccuracyStatsPage } from './accuracy-stats.page';

describe('AccuracyStatsPage', () => {
  let component: AccuracyStatsPage;
  let fixture: ComponentFixture<AccuracyStatsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AccuracyStatsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

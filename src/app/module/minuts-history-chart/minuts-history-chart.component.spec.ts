import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinutsHistoryChartComponent } from './minuts-history-chart.component';

describe('MinutsHistoryChartComponent', () => {
  let component: MinutsHistoryChartComponent;
  let fixture: ComponentFixture<MinutsHistoryChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MinutsHistoryChartComponent]
    });
    fixture = TestBed.createComponent(MinutsHistoryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

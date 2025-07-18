import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsTradingAccountsComponent } from './analytics-trading-accounts.component';

describe('AnalyticsTradingAccountsComponent', () => {
  let component: AnalyticsTradingAccountsComponent;
  let fixture: ComponentFixture<AnalyticsTradingAccountsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AnalyticsTradingAccountsComponent]
    });
    fixture = TestBed.createComponent(AnalyticsTradingAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

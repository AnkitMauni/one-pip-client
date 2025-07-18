import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingAccountsComponent } from './trading-accounts.component';

describe('TradingAccountsComponent', () => {
  let component: TradingAccountsComponent;
  let fixture: ComponentFixture<TradingAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradingAccountsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TradingAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

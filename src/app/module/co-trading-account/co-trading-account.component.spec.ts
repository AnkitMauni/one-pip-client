import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoTradingAccountComponent } from './co-trading-account.component';

describe('CoTradingAccountComponent', () => {
  let component: CoTradingAccountComponent;
  let fixture: ComponentFixture<CoTradingAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoTradingAccountComponent]
    });
    fixture = TestBed.createComponent(CoTradingAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

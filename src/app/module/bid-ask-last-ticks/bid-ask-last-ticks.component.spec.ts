import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidAskLastTicksComponent } from './bid-ask-last-ticks.component';

describe('BidAskLastTicksComponent', () => {
  let component: BidAskLastTicksComponent;
  let fixture: ComponentFixture<BidAskLastTicksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BidAskLastTicksComponent]
    });
    fixture = TestBed.createComponent(BidAskLastTicksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

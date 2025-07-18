import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDealsComponent } from './order-deals.component';

describe('OrderDealsComponent', () => {
  let component: OrderDealsComponent;
  let fixture: ComponentFixture<OrderDealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDealsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderDealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

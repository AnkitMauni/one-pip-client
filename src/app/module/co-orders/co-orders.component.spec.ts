import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoOrdersComponent } from './co-orders.component';

describe('CoOrdersComponent', () => {
  let component: CoOrdersComponent;
  let fixture: ComponentFixture<CoOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoOrdersComponent]
    });
    fixture = TestBed.createComponent(CoOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

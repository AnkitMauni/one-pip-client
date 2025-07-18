import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenOrderComponent } from './open-order.component';

describe('OpenOrderComponent', () => {
  let component: OpenOrderComponent;
  let fixture: ComponentFixture<OpenOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OpenOrderComponent]
    });
    fixture = TestBed.createComponent(OpenOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

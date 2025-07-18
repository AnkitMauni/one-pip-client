import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsAndOrdersComponent } from './clients-and-orders.component';

describe('ClientsAndOrdersComponent', () => {
  let component: ClientsAndOrdersComponent;
  let fixture: ComponentFixture<ClientsAndOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClientsAndOrdersComponent]
    });
    fixture = TestBed.createComponent(ClientsAndOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoClientComponent } from './co-client.component';

describe('CoClientComponent', () => {
  let component: CoClientComponent;
  let fixture: ComponentFixture<CoClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoClientComponent]
    });
    fixture = TestBed.createComponent(CoClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketwatchComponent } from './marketwatch.component';

describe('MarketwatchComponent', () => {
  let component: MarketwatchComponent;
  let fixture: ComponentFixture<MarketwatchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarketwatchComponent]
    });
    fixture = TestBed.createComponent(MarketwatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

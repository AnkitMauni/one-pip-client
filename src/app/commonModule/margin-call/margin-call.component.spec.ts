import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarginCallComponent } from './margin-call.component';

describe('MarginCallComponent', () => {
  let component: MarginCallComponent;
  let fixture: ComponentFixture<MarginCallComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarginCallComponent]
    });
    fixture = TestBed.createComponent(MarginCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

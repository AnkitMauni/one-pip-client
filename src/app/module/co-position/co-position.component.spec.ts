import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoPositionComponent } from './co-position.component';

describe('CoPositionComponent', () => {
  let component: CoPositionComponent;
  let fixture: ComponentFixture<CoPositionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoPositionComponent]
    });
    fixture = TestBed.createComponent(CoPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynchronizationComponent } from './synchronization.component';

describe('SynchronizationComponent', () => {
  let component: SynchronizationComponent;
  let fixture: ComponentFixture<SynchronizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SynchronizationComponent]
    });
    fixture = TestBed.createComponent(SynchronizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

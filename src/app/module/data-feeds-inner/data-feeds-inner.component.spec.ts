import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFeedsInnerComponent } from './data-feeds-inner.component';

describe('DataFeedsInnerComponent', () => {
  let component: DataFeedsInnerComponent;
  let fixture: ComponentFixture<DataFeedsInnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataFeedsInnerComponent]
    });
    fixture = TestBed.createComponent(DataFeedsInnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

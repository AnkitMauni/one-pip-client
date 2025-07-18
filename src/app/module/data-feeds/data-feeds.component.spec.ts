import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFeedsComponent } from './data-feeds.component';

describe('DataFeedsComponent', () => {
  let component: DataFeedsComponent;
  let fixture: ComponentFixture<DataFeedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataFeedsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataFeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

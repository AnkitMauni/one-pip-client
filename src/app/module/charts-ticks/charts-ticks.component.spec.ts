import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsTicksComponent } from './charts-ticks.component';

describe('ChartsTicksComponent', () => {
  let component: ChartsTicksComponent;
  let fixture: ComponentFixture<ChartsTicksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartsTicksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChartsTicksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

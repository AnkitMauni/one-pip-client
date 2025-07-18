import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealComponent } from './real.component';

describe('RealComponent', () => {
  let component: RealComponent;
  let fixture: ComponentFixture<RealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

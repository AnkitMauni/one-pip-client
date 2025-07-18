import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByCountryComponent } from './by-country.component';

describe('ByCountryComponent', () => {
  let component: ByCountryComponent;
  let fixture: ComponentFixture<ByCountryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ByCountryComponent]
    });
    fixture = TestBed.createComponent(ByCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

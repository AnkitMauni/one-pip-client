import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisingCampaignsComponent } from './advertising-campaigns.component';

describe('AdvertisingCampaignsComponent', () => {
  let component: AdvertisingCampaignsComponent;
  let fixture: ComponentFixture<AdvertisingCampaignsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdvertisingCampaignsComponent]
    });
    fixture = TestBed.createComponent(AdvertisingCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

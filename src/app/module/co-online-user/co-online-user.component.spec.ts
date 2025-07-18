import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoOnlineUserComponent } from './co-online-user.component';

describe('CoOnlineUserComponent', () => {
  let component: CoOnlineUserComponent;
  let fixture: ComponentFixture<CoOnlineUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoOnlineUserComponent]
    });
    fixture = TestBed.createComponent(CoOnlineUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

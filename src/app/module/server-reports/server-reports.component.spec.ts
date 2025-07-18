import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerReportsComponent } from './server-reports.component';

describe('ServerReportsComponent', () => {
  let component: ServerReportsComponent;
  let fixture: ComponentFixture<ServerReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ServerReportsComponent]
    });
    fixture = TestBed.createComponent(ServerReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

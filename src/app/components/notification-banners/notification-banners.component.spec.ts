import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationBannersComponent } from './notification-banners.component';

describe('NotificationBannersComponent', () => {
  let component: NotificationBannersComponent;
  let fixture: ComponentFixture<NotificationBannersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationBannersComponent]
    });
    fixture = TestBed.createComponent(NotificationBannersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

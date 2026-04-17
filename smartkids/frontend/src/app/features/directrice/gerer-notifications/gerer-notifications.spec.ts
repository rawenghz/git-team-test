import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GererNotifications } from './gerer-notifications';

describe('GererNotifications', () => {
  let component: GererNotifications;
  let fixture: ComponentFixture<GererNotifications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GererNotifications]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GererNotifications);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

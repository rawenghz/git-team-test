import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAnimatriceComponent} from './dashboard';

describe('DashboardAnimatriceComponent', () => {
  let component: DashboardAnimatriceComponent;
  let fixture: ComponentFixture<DashboardAnimatriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAnimatriceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAnimatriceComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectriceLayout } from './directrice-layout';

describe('DirectriceLayout', () => {
  let component: DirectriceLayout;
  let fixture: ComponentFixture<DirectriceLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectriceLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectriceLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

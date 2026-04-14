import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutDirectrice } from './layout-directrice';

describe('LayoutDirectrice', () => {
  let component: LayoutDirectrice;
  let fixture: ComponentFixture<LayoutDirectrice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutDirectrice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutDirectrice);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

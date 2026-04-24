import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutAnimatrice } from './layout-animatrice';

describe('LayoutAnimatrice', () => {
  let component: LayoutAnimatrice;
  let fixture: ComponentFixture<LayoutAnimatrice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutAnimatrice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutAnimatrice);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

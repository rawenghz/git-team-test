import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Children } from './children';

describe('Children', () => {
  let component: Children;
  let fixture: ComponentFixture<Children>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Children]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Children);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

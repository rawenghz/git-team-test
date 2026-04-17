import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GererEvenements } from './gerer-evenements';

describe('GererEvenements', () => {
  let component: GererEvenements;
  let fixture: ComponentFixture<GererEvenements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GererEvenements]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GererEvenements);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

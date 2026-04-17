import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireAnimatrice } from './formulaire-animatrice';

describe('FormulaireAnimatrice', () => {
  let component: FormulaireAnimatrice;
  let fixture: ComponentFixture<FormulaireAnimatrice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulaireAnimatrice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulaireAnimatrice);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

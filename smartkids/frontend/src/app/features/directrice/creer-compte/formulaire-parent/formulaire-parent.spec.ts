import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireParent } from './formulaire-parent';

describe('FormulaireParent', () => {
  let component: FormulaireParent;
  let fixture: ComponentFixture<FormulaireParent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulaireParent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulaireParent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

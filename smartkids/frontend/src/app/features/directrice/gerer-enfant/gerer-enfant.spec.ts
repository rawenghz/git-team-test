import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GererEnfant } from './gerer-enfant';

describe('GererEnfant', () => {
  let component: GererEnfant;
  let fixture: ComponentFixture<GererEnfant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GererEnfant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GererEnfant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

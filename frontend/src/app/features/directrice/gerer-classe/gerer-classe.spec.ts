import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GererClasse } from './gerer-classe';

describe('GererClasse', () => {
  let component: GererClasse;
  let fixture: ComponentFixture<GererClasse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GererClasse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GererClasse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

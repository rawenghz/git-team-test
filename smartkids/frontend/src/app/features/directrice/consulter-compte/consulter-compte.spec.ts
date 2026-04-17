import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsulterCompte } from './consulter-compte';

describe('ConsulterCompte', () => {
  let component: ConsulterCompte;
  let fixture: ComponentFixture<ConsulterCompte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsulterCompte]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsulterCompte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

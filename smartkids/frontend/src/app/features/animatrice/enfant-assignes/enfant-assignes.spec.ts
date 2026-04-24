import { ComponentFixture, TestBed } from '@angular/core/testing';

import {EnfantsComponent } from './enfant-assignes';

describe('EnfantsComponent', () => {
  let component: EnfantsComponent;
  let fixture: ComponentFixture<EnfantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnfantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnfantsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

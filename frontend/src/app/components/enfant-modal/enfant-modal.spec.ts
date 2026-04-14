import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnfantModalComponent } from './enfant-modal';

describe('EnfantModalComponent', () => {
  let component: EnfantModalComponent;
  let fixture: ComponentFixture<EnfantModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnfantModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EnfantModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
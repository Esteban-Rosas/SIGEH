import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicLayout } from './academic-layout';

describe('AcademicLayout', () => {
  let component: AcademicLayout;
  let fixture: ComponentFixture<AcademicLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

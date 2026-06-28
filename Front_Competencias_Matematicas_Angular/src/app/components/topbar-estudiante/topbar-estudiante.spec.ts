import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarEstudiante } from './topbar-estudiante';

describe('TopbarEstudiante', () => {
  let component: TopbarEstudiante;
  let fixture: ComponentFixture<TopbarEstudiante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopbarEstudiante],
    }).compileComponents();

    fixture = TestBed.createComponent(TopbarEstudiante);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

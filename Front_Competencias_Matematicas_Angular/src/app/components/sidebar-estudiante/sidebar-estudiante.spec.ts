import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarEstudiante } from './sidebar-estudiante';

describe('SidebarEstudiante', () => {
  let component: SidebarEstudiante;
  let fixture: ComponentFixture<SidebarEstudiante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarEstudiante],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarEstudiante);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

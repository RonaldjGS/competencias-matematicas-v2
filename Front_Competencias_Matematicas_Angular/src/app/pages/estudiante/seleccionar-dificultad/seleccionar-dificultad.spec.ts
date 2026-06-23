import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarDificultad } from './seleccionar-dificultad';

describe('SeleccionarDificultad', () => {
  let component: SeleccionarDificultad;
  let fixture: ComponentFixture<SeleccionarDificultad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionarDificultad],
    }).compileComponents();

    fixture = TestBed.createComponent(SeleccionarDificultad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

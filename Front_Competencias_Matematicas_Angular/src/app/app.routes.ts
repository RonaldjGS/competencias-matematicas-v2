import { Routes } from '@angular/router';

import {
  LoginEstudianteComponent
} from './pages/auth/login-estudiante/login-estudiante.component';

import {
  RegistroEstudianteComponent
} from './pages/auth/registro-estudiante/registro-estudiante.component';

import {
  LoginProfesorComponent
} from './pages/auth/login-profesor/login-profesor.component';

import {
  RegistroProfesorComponent
} from './pages/auth/registro-profesor/registro-profesor.component';

import {
  DashboardProfesorComponent
} from './pages/dashboard-profesor/dashboard-profesor.component';

import {
  PreguntasComponent
} from './pages/preguntas/preguntas.component';

import {

  DashboardEstudianteComponent

} from './pages/dashboard-estudiante/dashboard-estudiante.component';

import {
  SeleccionarCompetenciaComponent
} from './pages/estudiante/seleccionar-competencia/seleccionar-competencia.component';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login-estudiante',
    pathMatch: 'full'
  },

  {
  path: 'login-estudiante',
  component: LoginEstudianteComponent
  },

  {
  path: 'registro-estudiante',
  component: RegistroEstudianteComponent
  },

  {
  path: 'login-profesor',
  component: LoginProfesorComponent
  },

  {
    path: 'registro-profesor',
    component: RegistroProfesorComponent
  },

  //{
    //path: 'login-admin',
    //component: LoginAdminComponent
  //}

  {
    path: 'dashboard-profesor',
    component: DashboardProfesorComponent
  },

  {
    path: 'preguntas',
    component: PreguntasComponent
  },

  {
  path: 'dashboard-estudiante',
  component: DashboardEstudianteComponent
  },

  {
  path: 'seleccionar-competencia',
  component: SeleccionarCompetenciaComponent
  }


];
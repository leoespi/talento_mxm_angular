import { Routes } from '@angular/router';
import { BodyComponent } from './inicio/body/body.component'; 
import { IndexComponent as IndexUsers } from './users/index/index.component';
import { IndexComponent as IndexIncapacidades } from './incapacidades/index/index.component';
import { CreateComponent as CreateIncapacidades } from './incapacidades/create/create.component';
import { IndexComponent as IndexCesantias } from './cesantias/index/index.component';
import { CreateComponent as CreateCesantias } from './cesantias/create/create.component';
import { IndexComponent as IndexCesantiasAutorizadas } from './cesantiasautorizadas/index/index.component';
import { CreateComponent as CreateCesantiasAutorizadas } from './cesantiasautorizadas/create/create.component';
import { IndexComponent as IndexCesantiasDenegadas } from './cesantiasdenegadas/index/index.component';
import { IndexComponent as IndexReferidosComponent } from './Referidos/index/index.component';
import { CreateComponent as CreateReferidosComponent } from './Referidos/create/create.component';

import { RolesGuard } from './Guards/roles.guard';

import { ComunicacionGuard } from './Guards/comunicacion-guard.guard'; // Nuevo guardia para rol 3


export const routes: Routes = [
  { path: '', redirectTo: 'inicio/body', pathMatch: 'full' },
  { path: 'inicio/body', component: BodyComponent },
  { path: 'users/index', component: IndexUsers },
  { path: 'incapacidades/index', component: IndexIncapacidades },
  { path: 'incapacidades/create', component: CreateIncapacidades },
  { path: 'incapacidades/editar/:id', component: CreateIncapacidades },
  { path: 'cesantias/index', component: IndexCesantias },
  { path: 'cesantias/create', component: CreateCesantias },
  { path: 'cesantias/editar/:id', component: CreateCesantias },
  { path: 'cesantiasautorizadas/index', component: IndexCesantiasAutorizadas, canActivate: [RolesGuard] },
  { path: 'cesantiasautorizadas/create', component: CreateCesantiasAutorizadas },
  { path: 'cesantiasdenegadas/index', component: IndexCesantiasDenegadas },
  { path: 'referidos/index', component: IndexReferidosComponent }, // Comentar esta línea temporalmente
  { path: 'referidos/editar/:id', component: CreateReferidosComponent },
];



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

import { FeedListComponent } from './Feed/feed-list/feed-list.component';
import { CreateFeedComponent as CreateFeedComponent } from './Feed/create-feed/create-feed.component';

import { IndexComponent as IndexHomeComponent } from './home/index/index.component';


import { RolesGuard } from './Guards/roles.guard';

import { ComunicacionGuard } from './Guards/comunicacion-guard.guard'; // Nuevo guardia para rol 3

import { AdminGuard } from './Guards/admin.guard'; // Nuevo guardia para rol 3


export const routes: Routes = [
  { path: '', redirectTo: 'inicio/body', pathMatch: 'full' },
  { path: 'inicio/body', component: BodyComponent },
  { path: 'users/index', component: IndexUsers, canActivate: [AdminGuard]},
  { path: 'incapacidades/index', component: IndexIncapacidades , canActivate: [AdminGuard]},
  { path: 'incapacidades/create', component: CreateIncapacidades , canActivate: [AdminGuard]},
  { path: 'incapacidades/editar/:id', component: CreateIncapacidades, canActivate: [AdminGuard] },
  { path: 'cesantias/index', component: IndexCesantias , canActivate: [AdminGuard]},
  { path: 'cesantias/create', component: CreateCesantias , canActivate: [AdminGuard]},
  { path: 'cesantias/editar/:id', component: CreateCesantias , canActivate: [AdminGuard]},
  { path: 'cesantiasautorizadas/index', component: IndexCesantiasAutorizadas, canActivate: [AdminGuard] },
  { path: 'cesantiasautorizadas/create', component: CreateCesantiasAutorizadas, canActivate: [AdminGuard] },
  { path: 'referidos/index', component: IndexReferidosComponent , canActivate: [AdminGuard]}, // Comentar esta línea temporalmente
  { path: 'referidos/editar/:id', component: CreateReferidosComponent , canActivate: [AdminGuard]},
  { path: 'feeds/listado', component: FeedListComponent, canActivate: [ComunicacionGuard] }, // Nuevo guardia para rol 3
  { path: 'feeds/crear', component: CreateFeedComponent, canActivate: [ComunicacionGuard] }, // Nuevo guardia para rol 3
  { path: 'home/index', component: IndexHomeComponent }, // Nuevo guardia para rol 3
];



import { Routes } from '@angular/router';

import { BodyComponent } from './inicio/body/body.component'; 

import { IndexComponent as IndexUsers} from './users/index/index.component';
import { IndexComponent as IndexIncapacidades} from './incapacidades/index/index.component';
import { CreateComponent as CreateIncapacidades } from './incapacidades/create/create.component';

import { IndexComponent as IndexCesantias} from './cesantias/index/index.component';
import { CreateComponent as CreateCesantias } from './cesantias/create/create.component';



export const routes: Routes = [

    {path: '', redirectTo:'inicio/body',pathMatch:'full'},

    {path: 'inicio/body', component: BodyComponent },

    {path: 'users/index', component:IndexUsers},
    {path: 'incapacidades/index', component:IndexIncapacidades},
    {path: 'incapacidades/create', component:CreateIncapacidades},
    {path: 'incapacidades/editar/:id', component: CreateIncapacidades },
     
    {path: 'cesantias/index', component:IndexCesantias},
    {path: 'cesantias/create', component:CreateCesantias},
    {path: 'cesantias/editar/:id', component: CreateCesantias}

    
];


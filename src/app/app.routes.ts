import { Routes } from '@angular/router';

import { BodyComponent } from './inicio/body/body.component'; 

import { IndexComponent as IndexUsers} from './users/index/index.component';


export const routes: Routes = [

    {path: '', redirectTo:'inicio/body',pathMatch:'full'},

    {path: 'inicio/body', component: BodyComponent },

    {path: 'users/index', component:IndexUsers},
    
];


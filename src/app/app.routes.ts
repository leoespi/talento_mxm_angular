import { Routes } from '@angular/router';

import { BodyComponent } from './inicio/body/body.component'; 
export const routes: Routes = [

    {path: '', redirectTo:'inicio/body',pathMatch:'full'},

    {path: 'inicio/body', component: BodyComponent },
];


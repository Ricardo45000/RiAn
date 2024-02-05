import { Routes } from '@angular/router';
import { LockComponent } from './lock/lock.component';

export const PagesRoutes: Routes = [{
    path: '',
    children: [{
        path: 'lock',
        component: LockComponent
    }]
}];

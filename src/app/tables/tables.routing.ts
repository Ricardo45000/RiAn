import { Routes } from '@angular/router';
import { RegularTableComponent } from './regulartable/regulartable.component';

export const TablesRoutes: Routes = [{
        path: '',
        children: [{
            path: 'all',
            component: RegularTableComponent
        }]
    },
];

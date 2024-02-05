import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TablesRoutes } from './tables.routing';
import { RegularTableComponent } from './regulartable/regulartable.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(TablesRoutes),
        FormsModule,
        TranslateModule,
    ],
    declarations: [
        RegularTableComponent
    ],
})

export class TablesModule {}

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChartsComponent } from './charts.component';
import { ChartsRoutes } from './charts.routing';
import { AirtableService } from 'environments/airtable/airtable.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ChartsRoutes),
        FormsModule,
        TranslateModule
    ],
    declarations: [ChartsComponent],
})

export class ChartsModule {}

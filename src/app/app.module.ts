import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { TextMaskModule } from 'angular2-text-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppComponent } from './app.component';
import { NovaFaturaComponent } from './nova-fatura/nova-fatura.component';
import { RelatoriosComponent } from './relatorios/relatorios.component';
import { PersistenciaService } from 'app/persistencia.service';
import { NovaContaModalComponent } from './nova-conta-modal/nova-conta-modal.component';

const appRoutes: Routes = [
  { path: 'novaFatura', component: NovaFaturaComponent },
  { path: 'relatorios', component: RelatoriosComponent },
  { path: 'novaConta', component: NovaContaModalComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NovaFaturaComponent,
    RelatoriosComponent,
    NovaContaModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    NgbModule.forRoot(),
    AngularFontAwesomeModule,
    TextMaskModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [PersistenciaService],
  bootstrap: [AppComponent]
})
export class AppModule { }

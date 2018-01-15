import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NovaFaturaComponent } from './nova-fatura/nova-fatura.component';
import { RelatoriosComponent } from './relatorios/relatorios.component';
import { PersistenciaService } from 'app/persistencia.service';

const appRoutes: Routes = [
  { path: 'novaFatura', component: NovaFaturaComponent },
  { path: 'relatorios', component: RelatoriosComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NovaFaturaComponent,
    RelatoriosComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [PersistenciaService],
  bootstrap: [AppComponent]
})
export class AppModule { }

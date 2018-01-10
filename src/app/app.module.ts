import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { NovaFaturaComponent } from './nova-fatura/nova-fatura.component';
import { RelatoriosComponent } from './relatorios/relatorios.component';

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
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

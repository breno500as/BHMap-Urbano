import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BhMapModule } from './bhmap.module';
import { BhMapComponent } from './bhmap.component';

/**
 *  Módulo existente apenas para o import do BrowserModule.
 *  O BrowserModule é necessário para execução de forma local e
 *  não deve ser exportado para a aplicação que irá utilizar esse componente.
 *  @author breno.mcosta
 */

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BhMapModule
  ],
  bootstrap: [BhMapComponent]
})
export class AppModule { }

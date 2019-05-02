import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgHttpLoaderModule } from 'ng-http-loader/ng-http-loader.module';
import { BhMapComponent } from './bhmap.component';
import { PainelSelecaoCamadasComponent } from './components/painel-selecao-camadas/painel-selecao-camadas.component';
import { GeocoderService } from './services/geocoder.service';
import { BhMapService } from './services/bhmap.service';
import { BhMapImageService } from './services/bhmap-imagem.service';

@NgModule({
  declarations: [
    BhMapComponent,
    PainelSelecaoCamadasComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgHttpLoaderModule
  ],
  exports: [
    BhMapComponent
  ],
  providers: [
    GeocoderService,
    BhMapService,
    BhMapImageService
  ]
})
export class BhMapModule { }

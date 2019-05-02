import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TipoCamada } from '../../models/tipoCamada';


@Component({
  selector: 'app-painel-selecao-camadas',
  styleUrls: ['painel-selecao-camadas.component.css'],
  templateUrl: 'painel-selecao-camadas.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PainelSelecaoCamadasComponent),
    multi: true
  }]
})
export class PainelSelecaoCamadasComponent implements ControlValueAccessor {

    @Output()
    change = new EventEmitter<Array<TipoCamada>>();

    camadas = new Array<TipoCamada>();

    @Input()
    get model() {
        return this.camadas;
    }

    set model(value: Array<TipoCamada>) {
        this.camadas = value;
    }

    writeValue(value: Array<TipoCamada>) {
        if (value !== undefined) {
            this.camadas = value;
        }
    }

    propagateChange = (_: any) => { };

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    registerOnTouched() { }

    /**
     * Retorna todas as camadas selecionadas mais o valor da camada corrente, que pode ser selecionado ou não selecionado
     * para aplicar a visibilidade.
     * @param camadaCorrente
     */

    onChange(camadaCorrente: TipoCamada) {
     const camadasResultantes =  this.camadas.filter(c => c.selecionado && c.id !== camadaCorrente.id);
     camadasResultantes.push(camadaCorrente);
     this.change.emit(camadasResultantes);
    }
}

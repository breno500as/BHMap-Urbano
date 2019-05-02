import { EventEmitter } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { TipoCamada } from '../../models/tipoCamada';
export declare class PainelSelecaoCamadasComponent implements ControlValueAccessor {
    change: EventEmitter<TipoCamada[]>;
    camadas: TipoCamada[];
    model: Array<TipoCamada>;
    writeValue(value: Array<TipoCamada>): void;
    propagateChange: (_: any) => void;
    registerOnChange(fn: any): void;
    registerOnTouched(): void;
    /**
     * Retorna todas as camadas selecionadas mais o valor da camada corrente, que pode ser selecionado ou não selecionado
     * para aplicar a visibilidade.
     * @param camadaCorrente
     */
    onChange(camadaCorrente: TipoCamada): void;
}

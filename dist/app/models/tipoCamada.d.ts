import { CamadasEnum } from '../enums/camadasEnum';
import { TipoControlePontoEnum } from '../enums/tipoControlePontoEnum';
/**
 *  Objeto de configuração de camadas.
 */
export declare class TipoCamada {
    camadaEnum: CamadasEnum;
    wfs?: boolean;
    tipoControlePontoEnum?: TipoControlePontoEnum;
    visivel?: boolean;
    opacidade?: number;
    descricao?: string;
    selecionado?: boolean;
    habilitado?: boolean;
    id?: number;
    /**
     * Construtor com valores default.
     * @param params
     */
    constructor(params?: TipoCamada);
}

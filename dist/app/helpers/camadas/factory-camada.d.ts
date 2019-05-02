import { TipoCamada } from '../../models/tipoCamada';
import { AbstractCamada } from './abstract-camada';
export declare class FactoryCamada {
    tipoCamadaPrincipal: TipoCamada;
    /**
    *  Método que recupera a classe de callback da camada de acordo com a propriedade camadaPrincipal informada na
    *  classe TipoCamada.ts. A classe de callback é utilizada para chamadas no servidor backend do bhmaps  Ver: AbstractCamada.ts método:  getFeatureDataWFS()
    *  e adição de comportamentos específicos após a adição de features no mapa.
    * @param tiposCamadas
    */
    recuperaCallbacksCamada(tiposCamadas: Array<TipoCamada>): AbstractCamada;
}

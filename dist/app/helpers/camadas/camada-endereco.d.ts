import { BhMapComponent } from '../../bhmap.component';
import { AbstractCamada } from './abstract-camada';
/**
 *  Essa classe é uma extensão do componente BhMapComponent com características específicas de eventos.
 */
export declare class CamadaEndereco extends AbstractCamada {
    /**
     *  Executa o callback com informações da camada (objetoArr: Array<any>) obtidas após a chamada assíncrona do servidor do bhmaps.
     *  Ver: AbstractCamada.ts método:  getFeatureDataWFS()
     * @param objetoArr
     * @param bhMapComponentInstance
     *
     */
    executaCallback(objetoArr: Array<any>, bhMapComponentInstance: BhMapComponent): void;
    /**
    *  Callback disparado pelo evento de adição de alguma Feature no mapa. Exemplo: Ponto, Polígono etc.
    *  Possui as coordenadas da feature adicionada.
    * @param bhMapComponentInstance
    * @param ponto
    */
    featureAdded(bhMapComponentInstance: BhMapComponent, ponto: any): void;
}

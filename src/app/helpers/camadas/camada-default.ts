import { BhMapComponent } from '../../bhmap.component';
import { AbstractCamada } from './abstract-camada';

/**
 *  Implementação para camadas que não exigem nenhum tipo de tratamento de negócio, apenas emitem o resultado da chamada wfs.
 */

export class CamadaDefault extends AbstractCamada {

    /**
     *  Executa o callback com informações da camada (objetoArr: Array<any>) obtidas após a chamada assíncrona do servidor do bhmaps.
     *  Ver: AbstractCamada.ts método:  getFeatureDataWFS()
     * @param objetoArr
     * @param bhMapComponentInstance
     * @param ponto
     */
    executaCallback(objetoArr: Array<any>, bhMapComponentInstance: BhMapComponent, ponto: any): void {
        if (objetoArr.length > 0) {
            const objetosRetorno = objetoArr.map((obj: any) => {
                return { objRetorno: obj, ponto: ponto };
            });
            bhMapComponentInstance.emitter.emit({ objetosRetorno: objetosRetorno });
        } else {
            alert('Ponto não encontrado');
        }
    }


    /**
      *  Callback disparado pelo evento de adição de alguma Feature no mapa. Exemplo: Ponto, Polígono etc.
      *  Possui as coordenadas da feature adicionada.
      * @param bhMapComponentInstance
      * @param ponto
    */

    featureAdded(bhMapComponentInstance: BhMapComponent, ponto: any): void {
        super.featureAddedWFS(bhMapComponentInstance, ponto);
    }

}

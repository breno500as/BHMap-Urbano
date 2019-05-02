import { BhMapComponent } from '../../bhmap.component';
import { AbstractCamada } from './abstract-camada';

export class CamadaParque extends AbstractCamada {


     /**
     *  Executa o callback com informações da camada (objetoArr: Array<any>) obtidas após a chamada assíncrona do servidor do bhmaps.
     *  Ver: AbstractCamada.ts método:  getFeatureDataWFS()
     * @param objetoArr
     * @param bhMap
     * @param angularEventEmitter
     * @param ponto
     */
    executaCallback(objetoArr: Array<any>, bhMapComponentInstance: BhMapComponent, ponto: any): void {

        const bhMap =  bhMapComponentInstance.bhMap;

        if (!objetoArr || objetoArr.length === 0) {
            alert('Parque não encontrado.');
            bhMap.removerPontos();
        } else {
            const parque = objetoArr[0].data;

            if (confirm(`Confirma a seleção do parque: "${parque.NOME}" ?`)) {
                bhMapComponentInstance.emitter.emit({ objetosRetorno: [{ parque: parque, ponto: ponto }] });
            } else {
                bhMap.removerPontos();
            }
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
import { EventEmitter } from '@angular/core';
import { BhMapComponent } from '../../bhmap.component';
import { TipoControlePontoEnum } from '../../enums/tipoControlePontoEnum';
import { distinctArrayByProperty } from '../../helpers/utils';
import { BhMap } from '../../models/bhMap';
import { ObjetoOutputMapa } from '../../models/objetoOutputMapa';
import { AbstractCamada } from './abstract-camada';

/**
 *  Essa classe é uma extensão do componente BhMapComponent com características específicas de eventos.
 */

export class CamadaLogradouro extends AbstractCamada {


  /**
   *  Executa o callback com informações da camada (objetoArr: Array<any>) obtidas após a chamada assíncrona do servidor do bhmaps.
   *  Ver: AbstractCamada.ts método:  getFeatureDataWFS()
   * @param objetoArr
   * @param bhMapComponentInstance
   * @param ponto
   */

  executaCallback(objetoArr: Array<any>, bhMapComponentInstance: BhMapComponent, ponto: any): void {

    const bhMap = bhMapComponentInstance.bhMap;
    const isPonto = bhMap.tipoControlePonto === TipoControlePontoEnum.ponto;

    if (objetoArr.length === 0) {
      alert('Logradouro não encontrado');
      isPonto ? bhMap.removeUltimoPonto() : bhMap.removerPontos();
    } else if (objetoArr.length > 10) {
      alert('Seleção de trajeto inválida, aproxime mais o mapa para escolha do trajeto');
      bhMap.removerPontos();
    } else {
      // Funções que evitam que um logradouro com o mesmo id seja retornado.
      const logradourosDistintos = distinctArrayByProperty(objetoArr, 'ID_LOGRADOURO');
      const arrayConcat = logradourosDistintos.concat(bhMap.objetosDistintos);
      bhMap.objetosDistintos = distinctArrayByProperty(arrayConcat, 'ID_LOGRADOURO');

      // Regras para trajetos.
      if ((bhMap.posicaoPonto === bhMap.numeroTotalPontos) || isPonto) {

        const arrayOrdenado = bhMap.objetosDistintos.reverse();

        const msg = arrayOrdenado.map(logradouro => `"${logradouro.TIPO_LOGRADOURO} ${logradouro.NOME_LOGRADOURO}"`).join().trim();

        if (confirm(`Confirma a seleção dos logradouros:\n ${msg}`)) {
          bhMapComponentInstance.emitter.emit({ objetosRetorno: arrayOrdenado });
        } else {
          bhMap.removerPontos();
        }

      } else {
        bhMap.posicaoPonto++;
      }

    }
  }


  /**
  *  Callback disparado pelo evento de adição de alguma Feature no mapa. Exemplo: Ponto, Polígono etc.
  *  Possui as coordenadas da feature adicionada.
  * @param bhMapComponentInstance
  * @param ponto
  */

  featureAdded(bhMapComponentInstance: BhMapComponent, ponto: any) {
    super.featureAddedWFS(bhMapComponentInstance, ponto);
  }
}

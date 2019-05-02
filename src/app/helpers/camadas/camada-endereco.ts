import { BhMapComponent } from '../../bhmap.component';
import { formataEndereco } from '../../helpers/utils';
import { AbstractCamada } from './abstract-camada';

/**
 *  Essa classe é uma extensão do componente BhMapComponent com características específicas de eventos.
 */

export class CamadaEndereco extends AbstractCamada {


  /**
   *  Executa o callback com informações da camada (objetoArr: Array<any>) obtidas após a chamada assíncrona do servidor do bhmaps.
   *  Ver: AbstractCamada.ts método:  getFeatureDataWFS()
   * @param objetoArr
   * @param bhMapComponentInstance
   * 
   */
  executaCallback(objetoArr: Array<any>, bhMapComponentInstance: BhMapComponent): void {
  }


  /**
  *  Callback disparado pelo evento de adição de alguma Feature no mapa. Exemplo: Ponto, Polígono etc.
  *  Possui as coordenadas da feature adicionada.
  * @param bhMapComponentInstance
  * @param ponto
  */

  featureAdded(bhMapComponentInstance: BhMapComponent, ponto: any) {


    const coordenadas = ponto.feature.getGeometry().getCoordinates();
    bhMapComponentInstance.bhMap.ultimoPontoAdicionado = ponto;

    bhMapComponentInstance.geocoderService.recuperaEnderecoPorGeometria(coordenadas[0], coordenadas[1], bhMapComponentInstance.isProduction).subscribe((resposta: any) => {

      const endereco = resposta.endereco[0];

      if (!endereco.id) {
        alert('Não foi encontrado um endereço para o ponto selecionado!');
        bhMapComponentInstance.bhMap.removeUltimoPonto();
        return;
      }

      const enderecoFormatado = formataEndereco(endereco);
      if (confirm(`Confirma a seleção do endereço: "${enderecoFormatado}" ?`)) {
        bhMapComponentInstance.emitter.emit({ objetosRetorno: [endereco] });
      } else {
        bhMapComponentInstance.bhMap.removeUltimoPonto();
      }

    }, (resposta => {
      bhMapComponentInstance.bhMap.removeUltimoPonto();
      alert('Ocorreu um erro ao recupera o endereço. Tente novamente mais tarde.');
      console.error(resposta.error.detalhes);
    }));
  }
}

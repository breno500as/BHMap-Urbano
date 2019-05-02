import GeoJSON from 'ol/format/GeoJSON';
import { BhMapComponent } from '../../bhmap.component';
import { TipoControlePontoEnum } from '../../enums/tipoControlePontoEnum';
import { BhMap } from '../../models/bhMap';
import { TipoCamada } from '../../models/tipoCamada';


/**
*  Definição do contrato a ser implementado para cada tipo de camada. Essa classe abstrata é uma extensão do componente BhMapComponent para tratar
*  comportamentos específicos das camadas do BhMaps. CamadasEnum.ts
*  @author breno.mcosta
*/

export abstract class AbstractCamada {

   /**
   *  Executa o callback com informações da camada (objetoArr: Array<any>) obtidas após a chamada assíncrona do servidor do bhmaps.
   *  Ver: AbstractCamada.ts método:  getFeatureDataWFS()
   * @param objetoArr
   * @param bhMapComponentInstance
   * @param ponto
   */

  abstract executaCallback(objetoArr: Array<any>, bhMapComponentInstance: BhMapComponent, ponto: any): void;

  /**
   *  Callback disparado pelo evento de adição de alguma Feature no mapa. Exemplo: Ponto, Polígono etc.
   *  Possui as coordenadas da feature adicionada.
   * @param bhMapComponentInstance
   * @param ponto
   */
  abstract featureAdded(bhMapComponentInstance: BhMapComponent, ponto: any): void;

   /**
   *  Por default retorna as mesmas camadas.
   */
  recuperaListaCamadasParaSelecao(tiposCamadas: Array<TipoCamada>): Array<TipoCamada> {
    return tiposCamadas;
  }

 /**
   * Para mapas com visibilidades específicas.
   * @param camadasSelecionadas
   * @param bhMap
   */
  configuraVisibilidadeEspecifico(camadasSelecionadas: Array<TipoCamada>, bhMap: BhMap): boolean {
    return false;
  }

  /**
  * Método que configura o ponto para obter um json de informações da camada corrente via requisição HTTP
  * no servidor do bhmaps.
  * @param bhMapComponentInstance
  * @param ponto
  */
  featureAddedWFS(bhMapComponentInstance: BhMapComponent, ponto: any) {

    bhMapComponentInstance.bhMap.ultimoPontoAdicionado = ponto;
    const coordenadas = ponto.feature.getGeometry().getCoordinates();

    if (bhMapComponentInstance.bhMap.tipoControlePonto === TipoControlePontoEnum.ponto) {
      this.getFeatureDataWFS(bhMapComponentInstance, coordenadas);
    } else {
      bhMapComponentInstance.bhMap.numeroTotalPontos = coordenadas.length;
      bhMapComponentInstance.bhMap.posicaoPonto = 1;

      coordenadas.forEach((coordenada: any) => {
        this.getFeatureDataWFS(bhMapComponentInstance, coordenada);
      });

    }
  }

  /**
   *  Recupera a feature pela coordenada.
   * @param bhMapComponentInstance
   * @param coordenadas
   */

  private getFeatureDataWFS(bhMapComponentInstance: BhMapComponent, coordenadas: [number, number]) {
    bhMapComponentInstance.bhMapService.getFeatureDataWFS(coordenadas, bhMapComponentInstance.bhMap).subscribe((json: any) => {
      const features = new GeoJSON().readFeatures(json);
      const results = features ? features.map((feature: any) => Object.assign({}, feature.values_)) : [];
      this.executaCallback(results, bhMapComponentInstance, bhMapComponentInstance.emitter);
    });
  }

}

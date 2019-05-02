import { BhMapComponent } from '../../bhmap.component';
import { BhMap } from '../../models/bhMap';
import { TipoCamada } from '../../models/tipoCamada';
/**
*  Definição do contrato a ser implementado para cada tipo de camada. Essa classe abstrata é uma extensão do componente BhMapComponent para tratar
*  comportamentos específicos das camadas do BhMaps. CamadasEnum.ts
*  @author breno.mcosta
*/
export declare abstract class AbstractCamada {
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
    recuperaListaCamadasParaSelecao(tiposCamadas: Array<TipoCamada>): Array<TipoCamada>;
    /**
      * Para mapas com visibilidades específicas.
      * @param camadasSelecionadas
      * @param bhMap
      */
    configuraVisibilidadeEspecifico(camadasSelecionadas: Array<TipoCamada>, bhMap: BhMap): boolean;
    /**
    * Método que configura o ponto para obter um json de informações da camada corrente via requisição HTTP
    * no servidor do bhmaps.
    * @param bhMapComponentInstance
    * @param ponto
    */
    featureAddedWFS(bhMapComponentInstance: BhMapComponent, ponto: any): void;
    /**
     *  Recupera a feature pela coordenada.
     * @param bhMapComponentInstance
     * @param coordenadas
     */
    private getFeatureDataWFS;
}

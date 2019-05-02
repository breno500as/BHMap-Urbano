import { BhMapComponent } from '../../bhmap.component';
import { CamadasEnum } from '../../enums/camadasEnum';
import { idAreaTrechoLogradouro } from '../../helpers/utils';
import { BhMap } from '../../models/bhMap';
import { ObjetoOutputMapa } from '../../models/objetoOutputMapa';
import { TipoCamada } from '../../models/tipoCamada';
import { AbstractCamada } from './abstract-camada';

/**
 *  Essa classe é uma extensão do componente BhMapComponent com características específicas de obras em logradouros.
 */

export class CamadaAreaTrechoLogradouro extends AbstractCamada {


  /**
  *  Callback disparado pelo evento de adição de alguma Feature no mapa. Exemplo: Ponto, Polígono etc.
  *  Possui as coordenadas da feature adicionada.
  * @param bhMapComponentInstance
  * @param ponto
  */

  featureAdded(bhMapComponentInstance: BhMapComponent, ponto: any) {
    super.featureAddedWFS(bhMapComponentInstance, ponto);
  }

  /**
   *  Executa o callback com informações da camada (objetoArr: Array<any>) obtidas após a chamada assíncrona do servidor do bhmaps.
   *  Ver: AbstractCamada.ts método:  getFeatureDataWFS()
   * @param objetoArr
   * @param bhMapComponentInstance
   * @param ponto
   */

  executaCallback(objetoArr: Array<any>, bhMapComponentInstance: BhMapComponent, ponto: any): void {

    const bhMap = bhMapComponentInstance.bhMap;

    // Evita o desenho do ponto caso o usuario clique fora de uma area
    if (objetoArr.length === 0 && bhMap.ultimoPontoAdicionado) {
      bhMap.removeUltimoPonto();
      return;
    }

    objetoArr.forEach((objetoRetorno: any) => {

      const id = objetoRetorno[idAreaTrechoLogradouro];

      // Evita que mais de um ponto seja adicionado em uma mesma area
      if (bhMap.idsJaAdicionados && bhMap.idsJaAdicionados.find((idJaAdicionado: any) => idJaAdicionado.id === objetoRetorno[idAreaTrechoLogradouro])) {
        bhMap.removeUltimoPonto();
        return;
      }

      // Adiciona o id para futuro retorno via @Output
      bhMap.idsJaAdicionados.push({ id: id, ponto: bhMap.ultimoPontoAdicionado, geometry: objetoRetorno.geometry });

      const objetoOutputMapa = new ObjetoOutputMapa();
      objetoOutputMapa.objetosRetorno = [{id: id, ponto: ponto}];
      bhMapComponentInstance.emitter.emit(objetoOutputMapa);

    });
  }

  configuraVisibilidadeEspecifico(camadasSelecionadas: Array<TipoCamada>, bhMap: BhMap): boolean {

    const layer = bhMap.recuperaCamadaPeloId(CamadasEnum.ObraLogradouro);
    const resultado = camadasSelecionadas.filter(c => c.habilitado && c.selecionado).map(c => `COD_PROFUNDIDADE=${c.id}`).join(' OR ');

    if (resultado.length > 0) {
      layer.setVisible(true);
      layer.getSource().updateParams({ 'CQL_FILTER': resultado });
    } else {
      layer.setVisible(false);
    }

    return true;
  }

  recuperaListaCamadasParaSelecao(tiposCamadas: Array<TipoCamada>): Array<TipoCamada> {
    const array = new Array<TipoCamada>().concat(tiposCamadas);

    // Carrega subcamadas da camada de obras / area trecho logradouro.
    array.push(new TipoCamada({ camadaEnum: CamadasEnum.ObraLogradouro, id: 2, descricao: 'Obras 1 a 2 metros' }));
    array.push(new TipoCamada({ camadaEnum: CamadasEnum.ObraLogradouro, id: 3, descricao: 'Obras 2 a 3 metros' }));
    array.push(new TipoCamada({ camadaEnum: CamadasEnum.ObraLogradouro, id: 4, descricao: 'Obras 3 a 4 metros' }));
    array.push(new TipoCamada({ camadaEnum: CamadasEnum.ObraLogradouro, id: 5, descricao: 'Obras acima de 4 metros' }));
    array.push(new TipoCamada({ camadaEnum: CamadasEnum.ObraLogradouro, id: 6, descricao: 'Obras aéreas' }));
    array.push(new TipoCamada({ camadaEnum: CamadasEnum.ObraLogradouro, id: 7, descricao: 'Obras sobre a superfície' }));
    return array;
  }

}

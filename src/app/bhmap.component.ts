import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Spinkit } from 'ng-http-loader/spinkits';
import Draw from 'ol/interaction/Draw';
import { TipoControlePontoEnum } from './enums/tipoControlePontoEnum';
import { AbstractCamada } from './helpers/camadas/abstract-camada';
import { caminhoMetadados } from './helpers/utils';
import { BhMap } from './models/bhMap';
import { ObjetoOutputMapa } from './models/objetoOutputMapa';
import { TipoCamada } from './models/tipoCamada';
import { BhMapService } from './services/bhmap.service';
import { FactoryCamada } from './helpers/camadas/factory-camada';
import { GeocoderService } from './services/geocoder.service';
import { CamadasEnum } from './enums/camadasEnum';

/**
 *  Componente base que busca as camadas no servidor do bhmaps.
 *  Este componente carrega os callbacks das camadas e suas características específicas de acordo
 *  a classe TipoCamada.ts.
 *  O projeto utiliza o OpenLayers 5 como base.
 *  @author breno.mcosta
 */
@Component({
  selector: 'app-bhmap',
  styleUrls: ['bhMap.component.css'],
  templateUrl: 'bhMap.component.html'
})
export class BhMapComponent implements OnInit, OnDestroy {

  // Camadas do bhMaps.
  @Input()
  tiposCamadas: Array<TipoCamada> = [new TipoCamada({camadaEnum: CamadasEnum.Logradouro, tipoControlePontoEnum: TipoControlePontoEnum.trajeto})];

  // URL do servidor proxy no backend responsável por buscar recursos via https.
  @Input()
  urlProxy = 'http://localhost:8080/licenciamento/proxy?server=';


  // Variável de ambiente que determinará as urls do bhMaps (homologação ou produção).
  @Input()
  isProduction = false;

  // Objeto de saída.
  @Output()
  emitter: EventEmitter<ObjetoOutputMapa> = new EventEmitter<ObjetoOutputMapa>();

  @Input()
  painelSelecaoCamadas: boolean;

  @Input()
  msgErroEndereco: string;

   // Para camadas como endereço quando existem muitos endereços próximos o zoom máximo é indicado porém pode ser mais lento.
   @Input()
   zoomMaximo: boolean;

  // Classe abstrata responsável por chamadas de comportamentos
  // específicos de acordo com a camada principal do array tiposCamadas informado via @Input tiposCamadas
  // A criação de uma nova camada implica na extensão dessa classe.
  abstractCamada: AbstractCamada;

  // Enum tipo controle ponto
  tipoControlePontoEnum = TipoControlePontoEnum;

  // Quando for informado o Input painelSelecaoCamadas carrega por default as camadas do Input tiposCamadas no componente painel-selecao-camadas.component.ts
  tiposCamadasSelecaoUsuario: Array<TipoCamada>;

  // Objeto local do bhMaps.
  bhMap: BhMap;

  // Pesquisa de logradouro e endereço
  // Campos referentes a aba de filtros de pesquisa e zoom do mapa.
  nomeLogradouro: string;
  numeroLogradouro: number;
  nomeParque: string;
  enderecos: Array<any>;
  parques: Array<any>;

  // Draw openlayers
  draw: Draw;

  // Componente de espera durante o loading de uma chamada HttpClient
  spinkit = Spinkit;
  factoryCamada = new FactoryCamada();

  constructor(public geocoderService: GeocoderService, public bhMapService: BhMapService) {
  }

  ngOnInit(): void {

    // Instancia o objeto local do bhMaps.
    // Esse objeto é responsável por fazer as chamadas das imagens do mapa via GET no servidor do bhMaps,
    // desenhar a div via innerHtml e configurações em geral.
    this.bhMap = new BhMap(this.urlProxy, this.isProduction);

    // Carrega a concreta com métodos específicos da camada pelo array tiposCamadas (@Input() tiposCamadas).
    // Utiliza a camada principal  do array tiposCamadas para busca de informações no servidor de backend do bhmaps
    // (Ver: AbstractCamada.ts método:  getFeatureDataWFS()).
    this.abstractCamada = this.factoryCamada.recuperaCallbacksCamada(this.tiposCamadas);

    //   Adiciona configurações dinâmicas do mapa.
    this.carregarCamadas();
    this.adicionaControlePonto();
    this.adicionaPainelSelecaoCamadas();
  }

  /**
   * Busca o json das camadas do servidor do bhMaps.
   * @param caminhoAPI
   */
  carregarCamadas() {

    this.tiposCamadas.forEach((tipoCamada: TipoCamada) => {
      this.bhMapService.buscaCamadaBhMap(`${this.bhMap.proxyHost}${this.bhMap.host}${caminhoMetadados}/${tipoCamada.camadaEnum}`).subscribe((layer: any) => {
        this.bhMap.addLayerWMS(layer, tipoCamada.visivel, tipoCamada.opacidade);
        if (tipoCamada.wfs) {
          this.bhMap.camadaPrincipal = layer;
        }
      });
    });
  }

  /**
   * Recupera o tipo de controle do ponto (desenho, trajeto, etc), o default é o desenho do ponto.
   */

  adicionaControlePonto() {

    this.bhMap.tipoControlePonto = this.factoryCamada.tipoCamadaPrincipal.tipoControlePontoEnum;

    this.draw = new Draw({
      source: this.bhMap.source,
      type: this.bhMap.tipoControlePonto
    });

    const bhMapComponentInstance = this;

    this.bhMap.source.on('addfeature', function (evt: any) {
      bhMapComponentInstance.abstractCamada.featureAdded(bhMapComponentInstance, evt);
    });

    this.bhMap.map.addInteraction(this.draw);
  }

  /**
   *  Quando for informado o Input painelSelecaoCamadas carrega por default as camadas do Input tiposCamadas no componente painel-selecao-camadas.component.ts.
   *   Também permite adicionar mais camadas ou subcamadas de acordo com a configuração da camadaPrincipal.
   */

  adicionaPainelSelecaoCamadas() {

    if (this.painelSelecaoCamadas) {
      this.tiposCamadasSelecaoUsuario = this.abstractCamada.recuperaListaCamadasParaSelecao(this.tiposCamadas);
    }
  }

  /**
   *  Método de zoom in do mapa.
   */

  zoomIn(): boolean {
    const view = this.bhMap.map.getView();
    const zoom = view.getZoom();
    view.setZoom(zoom + 1);
    return false;
  }

  /**
   *  Método de zoom out do mapa.
   */

  zoomOut(): boolean {
    const view = this.bhMap.map.getView();
    const zoom = view.getZoom();
    view.setZoom(zoom - 1);
    return false;
  }

  removerPontos() {
    this.bhMap.removerPontos();
    this.bhMap.map.removeInteraction(this.draw);
    this.bhMap.map.addInteraction(this.draw);
  }

  configuraVisibilidade(id: string, selecionado: boolean) {
    const layer = this.bhMap.recuperaCamadaPeloId(id);
    layer.setVisible(selecionado);
  }

  /**
   * Callback para o painel de seleção de camadas.
   * @param event
   */

  changeCamada(camadasSelecionadas: Array<TipoCamada>) {

    if (camadasSelecionadas.length && !this.abstractCamada.configuraVisibilidadeEspecifico(camadasSelecionadas, this.bhMap)) {
      camadasSelecionadas.filter(c => c.habilitado).forEach(c => this.configuraVisibilidade(c.camadaEnum, c.selecionado));
    }
  }

  /**
   * Necessário ser no keypress. keyup.enter é tarde demais para evitar a propagação do método (preventDefault() não funciona)
   * @param event
   */

  keypressLogradouro(event: KeyboardEvent): boolean {
    if (event.keyCode === 13) {
      return this.buscaLogradouro();
    }

    return true;
  }

  /**
   *  Busca pelo logradouro e número.
   */

  buscaLogradouro(): boolean {

    this.enderecos = null;

    this.geocoderService.recuperaEnderecosPorLogradouro(this.nomeLogradouro, this.numeroLogradouro, this.isProduction).subscribe(resposta => {
      if (resposta.status !== 'ok') {
        alert('Ocorreu um erro na resposta da pesquisa de endereço, tente novamente mais tarde.');
      } else if (resposta.endereco.length === 0) {
        if (this.msgErroEndereco) {
          alert(this.msgErroEndereco);
        } else {
          alert('Endereço não encontrado.');
        }
      } else if (resposta.endereco.length === 1) {

        const endereco = resposta.endereco[0];

        if (!endereco.id) {
          if (this.msgErroEndereco) {
            alert(this.msgErroEndereco);
          } else {
            alert('Endereço não encontrado.');
          }
          return false;
        }
        this.zoomEndereco(endereco);

      } else {
        this.enderecos = resposta.endereco;
      }
    }, (resposta => {
      alert('Ocorreu um erro ao buscar o logradouro. Tente novamente mais tarde.');
      console.error(resposta.error.detalhes);
    }));

    return false;
  }

  /**
   *  Limpa o grid de endereços.
   */

  limparEnderecos(): boolean {
    this.enderecos = null;
    return false;
  }

  /**
   * Faz a pesquisa no geocoder pelo o endereço parametrizado e utiliza o openlayers para o zoom do mapa.
   * @param endereco
   */
  zoomEndereco(endereco: any) {
    this.enderecos = null;
    this.geocoderService.zoomEndereco(endereco, this.bhMap);
  }

  ngOnDestroy(): void {
  }
}

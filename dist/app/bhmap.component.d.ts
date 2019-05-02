import { EventEmitter, OnDestroy, OnInit } from '@angular/core';
import Draw from 'ol/interaction/Draw';
import { TipoControlePontoEnum } from './enums/tipoControlePontoEnum';
import { AbstractCamada } from './helpers/camadas/abstract-camada';
import { BhMap } from './models/bhMap';
import { ObjetoOutputMapa } from './models/objetoOutputMapa';
import { TipoCamada } from './models/tipoCamada';
import { BhMapService } from './services/bhmap.service';
import { FactoryCamada } from './helpers/camadas/factory-camada';
import { GeocoderService } from './services/geocoder.service';
/**
 *  Componente base que busca as camadas no servidor do bhmaps.
 *  Este componente carrega os callbacks das camadas e suas características específicas de acordo
 *  a classe TipoCamada.ts.
 *  O projeto utiliza o OpenLayers 5 como base.
 *  @author breno.mcosta
 */
export declare class BhMapComponent implements OnInit, OnDestroy {
    geocoderService: GeocoderService;
    bhMapService: BhMapService;
    tiposCamadas: Array<TipoCamada>;
    urlProxy: string;
    isProduction: boolean;
    emitter: EventEmitter<ObjetoOutputMapa>;
    painelSelecaoCamadas: boolean;
    msgErroEndereco: string;
    zoomMaximo: boolean;
    abstractCamada: AbstractCamada;
    tipoControlePontoEnum: typeof TipoControlePontoEnum;
    tiposCamadasSelecaoUsuario: Array<TipoCamada>;
    bhMap: BhMap;
    nomeLogradouro: string;
    numeroLogradouro: number;
    nomeParque: string;
    enderecos: Array<any>;
    parques: Array<any>;
    draw: Draw;
    spinkit: {
        skChasingDots: string;
        skCubeGrid: string;
        skDoubleBounce: string;
        skRotatingPlane: string;
        skSpinnerPulse: string;
        skThreeBounce: string;
        skWanderingCubes: string;
        skWave: string;
    };
    factoryCamada: FactoryCamada;
    constructor(geocoderService: GeocoderService, bhMapService: BhMapService);
    ngOnInit(): void;
    /**
     * Busca o json das camadas do servidor do bhMaps.
     * @param caminhoAPI
     */
    carregarCamadas(): void;
    /**
     * Recupera o tipo de controle do ponto (desenho, trajeto, etc), o default é o desenho do ponto.
     */
    adicionaControlePonto(): void;
    /**
     *  Quando for informado o Input painelSelecaoCamadas carrega por default as camadas do Input tiposCamadas no componente painel-selecao-camadas.component.ts.
     *   Também permite adicionar mais camadas ou subcamadas de acordo com a configuração da camadaPrincipal.
     */
    adicionaPainelSelecaoCamadas(): void;
    /**
     *  Método de zoom in do mapa.
     */
    zoomIn(): boolean;
    /**
     *  Método de zoom out do mapa.
     */
    zoomOut(): boolean;
    removerPontos(): void;
    configuraVisibilidade(id: string, selecionado: boolean): void;
    /**
     * Callback para o painel de seleção de camadas.
     * @param event
     */
    changeCamada(camadasSelecionadas: Array<TipoCamada>): void;
    /**
     * Necessário ser no keypress. keyup.enter é tarde demais para evitar a propagação do método (preventDefault() não funciona)
     * @param event
     */
    keypressLogradouro(event: KeyboardEvent): boolean;
    /**
     *  Busca pelo logradouro e número.
     */
    buscaLogradouro(): boolean;
    /**
     *  Limpa o grid de endereços.
     */
    limparEnderecos(): boolean;
    /**
     * Faz a pesquisa no geocoder pelo o endereço parametrizado e utiliza o openlayers para o zoom do mapa.
     * @param endereco
     */
    zoomEndereco(endereco: any): void;
    ngOnDestroy(): void;
}

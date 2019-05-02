import Map from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import { TipoControlePontoEnum } from '../enums/tipoControlePontoEnum';
/**
 *  Representa o modelo do bhmap.js
 */
export declare class BhMap {
    proxyHost: string;
    host: string;
    urlCamadas: string;
    ultimoPontoAdicionado: any;
    idsJaAdicionados: any[];
    objetosDistintos: any[];
    tipoControlePonto: TipoControlePontoEnum;
    numeroTotalPontos: number;
    posicaoPonto: number;
    map: Map;
    source: VectorSource;
    camadaPrincipal: any;
    private resolucoesMapa;
    private extent;
    private layers;
    private tileGrid;
    constructor(urlProxy: string, isProduction: boolean);
    /**
     *  Open layers vem por default com a projeção: World Geodetic System 1984, EPSG:4326
     *  Por esse motivo é necessário sobrescrever com a projeção utilizada pelo BHMaps da prodabel.
     */
    private configuraProjecao;
    /**
     *  Configura o mapa com o objeto camada utilizando o utilitário do OpenLayers.
     */
    private configMap;
    private addBaseLayerWMS;
    addLayerWMS(layer: any, visivel: boolean, opacidade: number): void;
    private createMap;
    centerMap(cordenadas: [number, number]): void;
    recuperaCamadaPeloId(caminho: string): any;
    removeUltimoPonto(): void;
    removerPontos(): void;
}

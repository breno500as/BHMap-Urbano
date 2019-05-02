/*
import TileLayer from 'ol/layer/Tile';
import Layer from 'ol/layer/Layer';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';

import VectorSource from 'ol/source/Vector';

import TileGrid from 'ol/tilegrid/TileGrid';
import View from 'ol/View';
import * as proj4x from 'proj4'; */

import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import TileWMS from 'ol/source/TileWMS';
import { register } from 'ol/proj/proj4';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import TileGrid from 'ol/tilegrid/TileGrid';
import * as proj4x from 'proj4';
import { TipoControlePontoEnum } from '../enums/tipoControlePontoEnum';
import { epsg, getUrlBhMap, getUrlCamadas } from '../helpers/utils';

/**
 *  Representa o modelo do bhmap.js
 */
export class BhMap {

    proxyHost: string;
    host: string;
    urlCamadas: string;


    // Varíaveis de controle de ponto.
    ultimoPontoAdicionado: any;
    idsJaAdicionados = [];
    objetosDistintos = [];
    tipoControlePonto: TipoControlePontoEnum;
    numeroTotalPontos: number;
    posicaoPonto: number;

    // Novo
    map: Map;
    source: VectorSource;
    camadaPrincipal: any;
    private resolucoesMapa: Array<number>;
    private extent: [number, number, number, number];
    private layers: Array<any> = new Array<any>();
    private tileGrid: TileGrid;


    constructor(urlProxy: string, isProduction: boolean) {
        this.proxyHost = urlProxy;
        this.host = getUrlBhMap(isProduction);
        this.urlCamadas = getUrlCamadas(isProduction);
        this.configMap();
    }

    /**
     *  Open layers vem por default com a projeção: World Geodetic System 1984, EPSG:4326
     *  Por esse motivo é necessário sobrescrever com a projeção utilizada pelo BHMaps da prodabel.
     */

    private configuraProjecao() {
        const proj4 = (proj4x as any).default;
        proj4.defs(epsg, '+proj=utm +zone=23 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
        proj4.defs('WGS84', '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees');
        register(proj4);

        //prj.setProj4();
        // register(proj4);
       // const proj = (projx as any);
       // projx.setProj4(proj4);
      //
    }


    /**
     *  Configura o mapa com o objeto camada utilizando o utilitário do OpenLayers.
     */

    private configMap() {

        this.configuraProjecao();

        this.resolucoesMapa = [55.99999999999999, 27.999999999999996, 13.999999999999998, 6.999999999999999, 2.8, 1.4, 0.5599999999999999, 0.27999999999999997];
        this.extent = [167058.56998217307, 6289251.342124983, 832941.430017827, 10567813.561305761];

        this.tileGrid = new TileGrid({
            extent: this.extent,
            resolutions: this.resolucoesMapa,
            tileSize: [256, 256]
        });

        this.addBaseLayerWMS();

        this.source = new VectorSource({ wrapX: false });

        this.layers.push(new VectorLayer({ source: this.source }));

        this.createMap();
    }

    private addBaseLayerWMS() {
        this.layers.push(
            new TileLayer({
                extent: this.extent,
                source: new TileWMS({
                    url: this.urlCamadas + 'wms',
                    params: {
                        'LAYERS': 'pbh_sirgas:S2000_BHBASE',
                        'TILED': true,
                        'GRIDSET': epsg,
                        'SRS': epsg,
                        'FORMAT': 'image/png'
                    },
                    tileGrid: this.tileGrid,
                }),
                opacity: 1,
            }));
    }

    addLayerWMS(layer: any, visivel: boolean, opacidade: number) {

          this.map.addLayer(new TileLayer({
              extent: this.extent,
              source: new TileWMS({
                  url: this.urlCamadas + 'wms',
                  params: {
                      'LAYERS': layer.servicos.wms.name,
                      'TILED': true,
                      'GRIDSET': epsg,
                      'SRS': epsg,
                      'FORMAT': 'image/png'
                  },
                  tileGrid: this.tileGrid,
              }),
              opacity: opacidade,
             // id: layer.id,
             zIndex: layer.id,
             visible: visivel
          }));
      }

    private createMap() {
        this.map = new Map({
            layers: this.layers,
            target: 'map',
            loadTilesWhileAnimating: false,
            loadTilesWhileInteracting: true,
            view: new View({
                center: [610398.62222215, 7796727.1334951],
                zoom: 0,
                projection: epsg,
                resolutions: this.resolucoesMapa,
                extent: this.extent
            })
        });
    }

    centerMap(cordenadas: [number, number]) {
        this.map.getView().setCenter(cordenadas);
        this.map.getView().setZoom(8);
    }

    recuperaCamadaPeloId(caminho: string): any {
        let l = null;
        this.map.getLayers().forEach((layer: TileLayer) => {
            if (caminho === layer.get('zIndex')) {
                l = layer;
            }
        });

        return l;
    }

    removeUltimoPonto() {
        if (this.ultimoPontoAdicionado) {
            this.source.removeFeature(this.ultimoPontoAdicionado.feature);
            this.ultimoPontoAdicionado = null;
        }
    }

    removerPontos() {
        this.idsJaAdicionados = [];
        this.source.clear();
    }

}


import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import TileWMS from 'ol/source/TileWMS';
import { register } from 'ol/proj/proj4';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import TileGrid from 'ol/tilegrid/TileGrid';
import proj4x__default from 'proj4';
import { HttpClient } from '@angular/common/http';
import { Injectable, Component, EventEmitter, Input, Output, forwardRef, NgModule } from '@angular/core';
import GeoJSON from 'ol/format/GeoJSON';
import { Spinkit } from 'ng-http-loader/spinkits';
import Draw from 'ol/interaction/Draw';
import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operators';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgHttpLoaderModule } from 'ng-http-loader/ng-http-loader.module';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ObjetoOutputMapa {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/** @enum {string} */
const CamadasEnum = {
    AreaTrechoLogradouro: 'area_trecho_logradouro',
    ObraLogradouro: 'obra_logradouro',
    Endereco: 'endereco',
    Logradouro: 'trecho_logradouro',
    Parque: 'parque',
    Praca: 'praca',
    PatrimonioCultural: 'a_definir',
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/** @enum {string} */
const TipoControlePontoEnum = {
    ponto: 'Point',
    trajeto: 'LineString',
    poligono: 'Polygon',
    circle: 'Circle',
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 *  Objeto de configuração de camadas.
 */
class TipoCamada {
    /**
     * Construtor com valores default.
     * @param {?=} params
     */
    constructor(params = /** @type {?} */ ({})) {
        this.camadaEnum = params.camadaEnum;
        this.wfs = params.wfs === undefined ? true : params.wfs;
        this.tipoControlePontoEnum = params.tipoControlePontoEnum ? params.tipoControlePontoEnum : TipoControlePontoEnum.ponto;
        this.visivel = params.visivel === undefined ? true : params.visivel;
        this.opacidade = params.opacidade === undefined ? 0.5 : params.opacidade;
        this.descricao = params.descricao;
        this.selecionado = params.selecionado === undefined ? false : params.selecionado;
        this.habilitado = params.habilitado === undefined ? true : params.habilitado;
        this.id = params.id;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const filtroEndereco = /rua\s+|avenida\s+|praca\s+|praça\s+|ave\s+|av.\s+|ave.\s+/gi;
const idAreaTrechoLogradouro = 'ID_AREA_TRECHO_LOGRADOURO';
const caminhoMetadados = 'v2/api/metacamada';
const epsg = 'EPSG:31983';
/**
 * @param {?} endereco
 * @return {?}
 */
function formataEndereco(endereco) {
    return `${endereco.tipologradouro} ${endereco.nomelogradouro} , Nº ${endereco.numero}`;
}
/**
 * @param {?} queryFilterObject
 * @return {?}
 */
function concatInQueryParams(queryFilterObject) {
    return Object.keys(queryFilterObject).map((key) => `${key}=${queryFilterObject[key]}`).join('&');
}
/**
 * @param {?} isProduction
 * @return {?}
 */
function getUrlBhMap(isProduction) {
    if (isProduction) {
        return 'http://bhmap.pbh.gov.br/';
    }
    return 'http://bhmap-hm.pbh.gov.br/';
}
/**
 * @param {?} isProduction
 * @return {?}
 */
function getUrlCamadas(isProduction) {
    if (isProduction) {
        return 'http://bhmapogcbase.pbh.gov.br/bhmapogcbase/';
    }
    return 'http://bhmapogcbase-hm.pbh.gov.br/bhmapogcbase/';
}
/**
 * @param {?} isProduction
 * @return {?}
 */
function getUrlGeocoder(isProduction) {
    if (isProduction) {
        return 'http://geocoder.pbh.gov.br/';
    }
    return 'http://geocoder-hm.pbh.gov.br/';
}
/**
 * @param {?} array
 * @param {?} prop
 * @param {?} prop2
 * @return {?}
 */

/**
 * @param {?} array
 * @param {?} prop
 * @return {?}
 */
function distinctArrayByProperty(array, prop) {
    return array.reduce((currentArray, item) => {
        if (!currentArray.find(currentItem => currentItem[prop] === item[prop])) {
            currentArray.push(item);
        }
        return currentArray;
    }, []);
}
/**
 * @param {?} geometrias
 * @param {?} buffer
 * @return {?}
 */
function calculaAreaImagemPorGeometrias(geometrias, buffer) {
    const /** @type {?} */ layers = new window['nomeObjetoOpenLayers'].Geometry.Collection();
    geometrias.forEach((geometria) => {
        layers.addComponent(geometria.geometry);
    });
    layers.calculateBounds();
    // pega o bounding box do conjunto
    const /** @type {?} */ oldBB = layers.getBounds();
    // faz um buffer ao redor da area
    const /** @type {?} */ newBB = new window['nomeObjetoOpenLayers'].Bounds(oldBB.left - buffer, oldBB.bottom - buffer, oldBB.right + buffer, oldBB.top + buffer);
    return newBB;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/*
import TileLayer from 'ol/layer/Tile';
import Layer from 'ol/layer/Layer';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import TileGrid from 'ol/tilegrid/TileGrid';
import View from 'ol/View';
import * as proj4x from 'proj4'; */
/**
 *  Representa o modelo do bhmap.js
 */
class BhMap {
    /**
     * @param {?} urlProxy
     * @param {?} isProduction
     */
    constructor(urlProxy, isProduction) {
        this.idsJaAdicionados = [];
        this.objetosDistintos = [];
        this.layers = new Array();
        this.proxyHost = urlProxy;
        this.host = getUrlBhMap(isProduction);
        this.urlCamadas = getUrlCamadas(isProduction);
        this.configMap();
    }
    /**
     *  Open layers vem por default com a projeção: World Geodetic System 1984, EPSG:4326
     *  Por esse motivo é necessário sobrescrever com a projeção utilizada pelo BHMaps da prodabel.
     * @return {?}
     */
    configuraProjecao() {
        const /** @type {?} */ proj4 = proj4x__default;
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
     * @return {?}
     */
    configMap() {
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
    /**
     * @return {?}
     */
    addBaseLayerWMS() {
        this.layers.push(new TileLayer({
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
    /**
     * @param {?} layer
     * @param {?} visivel
     * @param {?} opacidade
     * @return {?}
     */
    addLayerWMS(layer, visivel, opacidade) {
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
    /**
     * @return {?}
     */
    createMap() {
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
    /**
     * @param {?} cordenadas
     * @return {?}
     */
    centerMap(cordenadas) {
        this.map.getView().setCenter(cordenadas);
        this.map.getView().setZoom(8);
    }
    /**
     * @param {?} caminho
     * @return {?}
     */
    recuperaCamadaPeloId(caminho) {
        let /** @type {?} */ l = null;
        this.map.getLayers().forEach((layer) => {
            if (caminho === layer.get('zIndex')) {
                l = layer;
            }
        });
        return l;
    }
    /**
     * @return {?}
     */
    removeUltimoPonto() {
        if (this.ultimoPontoAdicionado) {
            this.source.removeFeature(this.ultimoPontoAdicionado.feature);
            this.ultimoPontoAdicionado = null;
        }
    }
    /**
     * @return {?}
     */
    removerPontos() {
        this.idsJaAdicionados = [];
        this.source.clear();
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class BhMapService {
    /**
     * @param {?} httpClient
     */
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    /**
     * @param {?} caminho
     * @return {?}
     */
    buscaCamadaBhMap(caminho) {
        return this.httpClient.get(caminho);
    }
    /**
     * Busca no servidor do BhMaps um json com informações da camada.
     * Este método também transforma a coordenada original em pixel para adicionar limites (superior / inferior) baseados em um raio e converte novamente
     * o pixel para as coordenadas inferior e superior, possibilitando uma pesquisa mais precisa.
     * @param {?} coordenadas
     * @param {?} bhMap
     * @return {?}
     */
    getFeatureDataWFS(coordenadas, bhMap) {
        const /** @type {?} */ camadaPrincipal = bhMap.camadaPrincipal;
        // Para adicionar o raio de pesquisa é necessário obter o pixel pela coordenada: Longitude / Latitude.
        const /** @type {?} */ pixel = bhMap.map.getPixelFromCoordinate(coordenadas);
        const /** @type {?} */ objetoPontoGeometria = { x: pixel[0], y: pixel[1] };
        let /** @type {?} */ raioBusca = 1;
        // Utiliza o raio padrão da camada se informado.
        if (camadaPrincipal.servicos.wfs.raiobusca) {
            raioBusca = camadaPrincipal.servicos.wfs.raiobusca;
        }
        // Faz um clone do pixel original e adiciona / diminui o raio.
        const /** @type {?} */ lowerPixel = Object.assign({}, objetoPontoGeometria);
        lowerPixel.x -= raioBusca;
        lowerPixel.y += raioBusca;
        // Obtém a coordenada inferior para ser utilizada como filtro na chamada do backend
        const /** @type {?} */ lowerCoordinates = bhMap.map.getCoordinateFromPixel([lowerPixel.x, lowerPixel.y]);
        // Faz um clone do pixel original e adiciona / diminui o raio.
        const /** @type {?} */ upperPixel = Object.assign({}, objetoPontoGeometria);
        upperPixel.x += raioBusca;
        upperPixel.y -= raioBusca;
        // Obtém a coordenada superior para ser utilizada como filtro na chamada do backend
        const /** @type {?} */ upperCoordinates = bhMap.map.getCoordinateFromPixel([upperPixel.x, upperPixel.y]);
        // Faz a chamada no backend utilizando os filtros.
        return this.httpClient.get(`${bhMap.proxyHost}${camadaPrincipal.servicos.wfs.url}?${this.getQueryParams(camadaPrincipal, lowerCoordinates, upperCoordinates)}`);
    }
    /**
     * Transforma um objeto de filtro em uma string.
     * @param {?} camadaPrincipal
     * @param {?} lowerCoordinates
     * @param {?} upperCoordinates
     * @return {?}
     */
    getQueryParams(camadaPrincipal, lowerCoordinates, upperCoordinates) {
        const /** @type {?} */ queryFilterObject = {
            SERVICE: 'WFS',
            REQUEST: 'GetFeature',
            VERSION: '1.1.0',
            TYPENAME: camadaPrincipal.servicos.wfs.workspace + ':' + camadaPrincipal.servicos.wfs.typename,
            OUTPUTFORMAT: 'json',
            FILTER: '<Filter xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml"><Intersects><PropertyName>' + camadaPrincipal.servicos.wfs.geom + '</PropertyName><gml:Envelope srsName="' + epsg + '">' +
                '<gml:lowerCorner>' + lowerCoordinates[0] + ' ' + lowerCoordinates[1] + '</gml:lowerCorner>' +
                ' <gml:upperCorner>' + upperCoordinates[0] + ' ' + upperCoordinates[1] + '</gml:upperCorner>' +
                '</gml:Envelope></Intersects></Filter>'
        };
        return concatInQueryParams(queryFilterObject);
    }
    /**
     * Recupera um json com a geometria
     * @param {?} typeName
     * @param {?} cqlFilterGeometria
     * @param {?} proxyHost
     * @param {?} urlBhMap
     * @return {?}
     */
    getFeature(typeName, cqlFilterGeometria, proxyHost, urlBhMap) {
        const /** @type {?} */ parametros = {
            version: '2.0',
            request: 'GetFeature',
            typeName: typeName,
            outputFormat: 'application/json',
            CQL_FILTER: `${cqlFilterGeometria}`
        };
        return this.httpClient.get(`${proxyHost}${urlBhMap}v2/api/wfs?${concatInQueryParams(parametros)}`);
    }
}
BhMapService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
BhMapService.ctorParameters = () => [
    { type: HttpClient, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 *  Definição do contrato a ser implementado para cada tipo de camada. Essa classe abstrata é uma extensão do componente BhMapComponent para tratar
 *  comportamentos específicos das camadas do BhMaps. CamadasEnum.ts
 *  \@author breno.mcosta
 * @abstract
 */
class AbstractCamada {
    /**
     *  Por default retorna as mesmas camadas.
     * @param {?} tiposCamadas
     * @return {?}
     */
    recuperaListaCamadasParaSelecao(tiposCamadas) {
        return tiposCamadas;
    }
    /**
     * Para mapas com visibilidades específicas.
     * @param {?} camadasSelecionadas
     * @param {?} bhMap
     * @return {?}
     */
    configuraVisibilidadeEspecifico(camadasSelecionadas, bhMap) {
        return false;
    }
    /**
     * Método que configura o ponto para obter um json de informações da camada corrente via requisição HTTP
     * no servidor do bhmaps.
     * @param {?} bhMapComponentInstance
     * @param {?} ponto
     * @return {?}
     */
    featureAddedWFS(bhMapComponentInstance, ponto) {
        bhMapComponentInstance.bhMap.ultimoPontoAdicionado = ponto;
        const /** @type {?} */ coordenadas = ponto.feature.getGeometry().getCoordinates();
        if (bhMapComponentInstance.bhMap.tipoControlePonto === TipoControlePontoEnum.ponto) {
            this.getFeatureDataWFS(bhMapComponentInstance, coordenadas);
        }
        else {
            bhMapComponentInstance.bhMap.numeroTotalPontos = coordenadas.length;
            bhMapComponentInstance.bhMap.posicaoPonto = 1;
            coordenadas.forEach((coordenada) => {
                this.getFeatureDataWFS(bhMapComponentInstance, coordenada);
            });
        }
    }
    /**
     *  Recupera a feature pela coordenada.
     * @param {?} bhMapComponentInstance
     * @param {?} coordenadas
     * @return {?}
     */
    getFeatureDataWFS(bhMapComponentInstance, coordenadas) {
        bhMapComponentInstance.bhMapService.getFeatureDataWFS(coordenadas, bhMapComponentInstance.bhMap).subscribe((json) => {
            const /** @type {?} */ features = new GeoJSON().readFeatures(json);
            const /** @type {?} */ results = features ? features.map((feature) => Object.assign({}, feature.values_)) : [];
            this.executaCallback(results, bhMapComponentInstance, bhMapComponentInstance.emitter);
        });
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 *  Essa classe é uma extensão do componente BhMapComponent com características específicas de obras em logradouros.
 */
class CamadaAreaTrechoLogradouro extends AbstractCamada {
    /**
     *  Callback disparado pelo evento de adição de alguma Feature no mapa. Exemplo: Ponto, Polígono etc.
     *  Possui as coordenadas da feature adicionada.
     * @param {?} bhMapComponentInstance
     * @param {?} ponto
     * @return {?}
     */
    featureAdded(bhMapComponentInstance, ponto) {
        super.featureAddedWFS(bhMapComponentInstance, ponto);
    }
    /**
     *  Executa o callback com informações da camada (objetoArr: Array<any>) obtidas após a chamada assíncrona do servidor do bhmaps.
     *  Ver: AbstractCamada.ts método:  getFeatureDataWFS()
     * @param {?} objetoArr
     * @param {?} bhMapComponentInstance
     * @param {?} ponto
     * @return {?}
     */
    executaCallback(objetoArr, bhMapComponentInstance, ponto) {
        const /** @type {?} */ bhMap = bhMapComponentInstance.bhMap;
        // Evita o desenho do ponto caso o usuario clique fora de uma area
        if (objetoArr.length === 0 && bhMap.ultimoPontoAdicionado) {
            bhMap.removeUltimoPonto();
            return;
        }
        objetoArr.forEach((objetoRetorno) => {
            const /** @type {?} */ id = objetoRetorno[idAreaTrechoLogradouro];
            // Evita que mais de um ponto seja adicionado em uma mesma area
            if (bhMap.idsJaAdicionados && bhMap.idsJaAdicionados.find((idJaAdicionado) => idJaAdicionado.id === objetoRetorno[idAreaTrechoLogradouro])) {
                bhMap.removeUltimoPonto();
                return;
            }
            // Adiciona o id para futuro retorno via @Output
            bhMap.idsJaAdicionados.push({ id: id, ponto: bhMap.ultimoPontoAdicionado, geometry: objetoRetorno.geometry });
            const /** @type {?} */ objetoOutputMapa = new ObjetoOutputMapa();
            objetoOutputMapa.objetosRetorno = [{ id: id, ponto: ponto }];
            bhMapComponentInstance.emitter.emit(objetoOutputMapa);
        });
    }
    /**
     * @param {?} camadasSelecionadas
     * @param {?} bhMap
     * @return {?}
     */
    configuraVisibilidadeEspecifico(camadasSelecionadas, bhMap) {
        const /** @type {?} */ layer = bhMap.recuperaCamadaPeloId(CamadasEnum.ObraLogradouro);
        const /** @type {?} */ resultado = camadasSelecionadas.filter(c => c.habilitado && c.selecionado).map(c => `COD_PROFUNDIDADE=${c.id}`).join(' OR ');
        if (resultado.length > 0) {
            layer.setVisible(true);
            layer.getSource().updateParams({ 'CQL_FILTER': resultado });
        }
        else {
            layer.setVisible(false);
        }
        return true;
    }
    /**
     * @param {?} tiposCamadas
     * @return {?}
     */
    recuperaListaCamadasParaSelecao(tiposCamadas) {
        const /** @type {?} */ array = new Array().concat(tiposCamadas);
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 *  Essa classe é uma extensão do componente BhMapComponent com características específicas de eventos.
 */
class CamadaEndereco extends AbstractCamada {
    /**
     *  Executa o callback com informações da camada (objetoArr: Array<any>) obtidas após a chamada assíncrona do servidor do bhmaps.
     *  Ver: AbstractCamada.ts método:  getFeatureDataWFS()
     * @param {?} objetoArr
     * @param {?} bhMapComponentInstance
     *
     * @return {?}
     */
    executaCallback(objetoArr, bhMapComponentInstance) {
    }
    /**
     *  Callback disparado pelo evento de adição de alguma Feature no mapa. Exemplo: Ponto, Polígono etc.
     *  Possui as coordenadas da feature adicionada.
     * @param {?} bhMapComponentInstance
     * @param {?} ponto
     * @return {?}
     */
    featureAdded(bhMapComponentInstance, ponto) {
        const /** @type {?} */ coordenadas = ponto.feature.getGeometry().getCoordinates();
        bhMapComponentInstance.bhMap.ultimoPontoAdicionado = ponto;
        bhMapComponentInstance.geocoderService.recuperaEnderecoPorGeometria(coordenadas[0], coordenadas[1], bhMapComponentInstance.isProduction).subscribe((resposta) => {
            const /** @type {?} */ endereco = resposta.endereco[0];
            if (!endereco.id) {
                alert('Não foi encontrado um endereço para o ponto selecionado!');
                bhMapComponentInstance.bhMap.removeUltimoPonto();
                return;
            }
            const /** @type {?} */ enderecoFormatado = formataEndereco(endereco);
            if (confirm(`Confirma a seleção do endereço: "${enderecoFormatado}" ?`)) {
                bhMapComponentInstance.emitter.emit({ objetosRetorno: [endereco] });
            }
            else {
                bhMapComponentInstance.bhMap.removeUltimoPonto();
            }
        }, (resposta => {
            bhMapComponentInstance.bhMap.removeUltimoPonto();
            alert('Ocorreu um erro ao recupera o endereço. Tente novamente mais tarde.');
            console.error(resposta.error.detalhes);
        }));
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 *  Essa classe é uma extensão do componente BhMapComponent com características específicas de eventos.
 */
class CamadaLogradouro extends AbstractCamada {
    /**
     *  Executa o callback com informações da camada (objetoArr: Array<any>) obtidas após a chamada assíncrona do servidor do bhmaps.
     *  Ver: AbstractCamada.ts método:  getFeatureDataWFS()
     * @param {?} objetoArr
     * @param {?} bhMapComponentInstance
     * @param {?} ponto
     * @return {?}
     */
    executaCallback(objetoArr, bhMapComponentInstance, ponto) {
        const /** @type {?} */ bhMap = bhMapComponentInstance.bhMap;
        const /** @type {?} */ isPonto = bhMap.tipoControlePonto === TipoControlePontoEnum.ponto;
        if (objetoArr.length === 0) {
            alert('Logradouro não encontrado');
            isPonto ? bhMap.removeUltimoPonto() : bhMap.removerPontos();
        }
        else if (objetoArr.length > 10) {
            alert('Seleção de trajeto inválida, aproxime mais o mapa para escolha do trajeto');
            bhMap.removerPontos();
        }
        else {
            // Funções que evitam que um logradouro com o mesmo id seja retornado.
            const /** @type {?} */ logradourosDistintos = distinctArrayByProperty(objetoArr, 'ID_LOGRADOURO');
            const /** @type {?} */ arrayConcat = logradourosDistintos.concat(bhMap.objetosDistintos);
            bhMap.objetosDistintos = distinctArrayByProperty(arrayConcat, 'ID_LOGRADOURO');
            // Regras para trajetos.
            if ((bhMap.posicaoPonto === bhMap.numeroTotalPontos) || isPonto) {
                const /** @type {?} */ arrayOrdenado = bhMap.objetosDistintos.reverse();
                const /** @type {?} */ msg = arrayOrdenado.map(logradouro => `"${logradouro.TIPO_LOGRADOURO} ${logradouro.NOME_LOGRADOURO}"`).join().trim();
                if (confirm(`Confirma a seleção dos logradouros:\n ${msg}`)) {
                    bhMapComponentInstance.emitter.emit({ objetosRetorno: arrayOrdenado });
                }
                else {
                    bhMap.removerPontos();
                }
            }
            else {
                bhMap.posicaoPonto++;
            }
        }
    }
    /**
     *  Callback disparado pelo evento de adição de alguma Feature no mapa. Exemplo: Ponto, Polígono etc.
     *  Possui as coordenadas da feature adicionada.
     * @param {?} bhMapComponentInstance
     * @param {?} ponto
     * @return {?}
     */
    featureAdded(bhMapComponentInstance, ponto) {
        super.featureAddedWFS(bhMapComponentInstance, ponto);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 *  Implementação para camadas que não exigem nenhum tipo de tratamento de negócio, apenas emitem o resultado da chamada wfs.
 */
class CamadaDefault extends AbstractCamada {
    /**
     *  Executa o callback com informações da camada (objetoArr: Array<any>) obtidas após a chamada assíncrona do servidor do bhmaps.
     *  Ver: AbstractCamada.ts método:  getFeatureDataWFS()
     * @param {?} objetoArr
     * @param {?} bhMapComponentInstance
     * @param {?} ponto
     * @return {?}
     */
    executaCallback(objetoArr, bhMapComponentInstance, ponto) {
        if (objetoArr.length > 0) {
            const /** @type {?} */ objetosRetorno = objetoArr.map((obj) => {
                return { objRetorno: obj, ponto: ponto };
            });
            bhMapComponentInstance.emitter.emit({ objetosRetorno: objetosRetorno });
        }
        else {
            alert('Ponto não encontrado');
        }
    }
    /**
     *  Callback disparado pelo evento de adição de alguma Feature no mapa. Exemplo: Ponto, Polígono etc.
     *  Possui as coordenadas da feature adicionada.
     * @param {?} bhMapComponentInstance
     * @param {?} ponto
     * @return {?}
     */
    featureAdded(bhMapComponentInstance, ponto) {
        super.featureAddedWFS(bhMapComponentInstance, ponto);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CamadaParque extends AbstractCamada {
    /**
     *  Executa o callback com informações da camada (objetoArr: Array<any>) obtidas após a chamada assíncrona do servidor do bhmaps.
     *  Ver: AbstractCamada.ts método:  getFeatureDataWFS()
     * @param {?} objetoArr
     * @param {?} bhMapComponentInstance
     * @param {?} ponto
     * @return {?}
     */
    executaCallback(objetoArr, bhMapComponentInstance, ponto) {
        const /** @type {?} */ bhMap = bhMapComponentInstance.bhMap;
        if (!objetoArr || objetoArr.length === 0) {
            alert('Parque não encontrado.');
            bhMap.removerPontos();
        }
        else {
            const /** @type {?} */ parque = objetoArr[0].data;
            if (confirm(`Confirma a seleção do parque: "${parque.NOME}" ?`)) {
                bhMapComponentInstance.emitter.emit({ objetosRetorno: [{ parque: parque, ponto: ponto }] });
            }
            else {
                bhMap.removerPontos();
            }
        }
    }
    /**
     *  Callback disparado pelo evento de adição de alguma Feature no mapa. Exemplo: Ponto, Polígono etc.
     *  Possui as coordenadas da feature adicionada.
     * @param {?} bhMapComponentInstance
     * @param {?} ponto
     * @return {?}
     */
    featureAdded(bhMapComponentInstance, ponto) {
        super.featureAddedWFS(bhMapComponentInstance, ponto);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class FactoryCamada {
    /**
     *  Método que recupera a classe de callback da camada de acordo com a propriedade camadaPrincipal informada na
     *  classe TipoCamada.ts. A classe de callback é utilizada para chamadas no servidor backend do bhmaps  Ver: AbstractCamada.ts método:  getFeatureDataWFS()
     *  e adição de comportamentos específicos após a adição de features no mapa.
     * @param {?} tiposCamadas
     * @return {?}
     */
    recuperaCallbacksCamada(tiposCamadas) {
        this.tipoCamadaPrincipal = tiposCamadas.filter(tipoCamada => tipoCamada.camadaEnum)[0];
        switch (this.tipoCamadaPrincipal.camadaEnum) {
            case CamadasEnum.Endereco:
                return new CamadaEndereco();
            case CamadasEnum.Logradouro:
                return new CamadaLogradouro();
            case CamadasEnum.Parque:
                return new CamadaParque();
            case CamadasEnum.AreaTrechoLogradouro:
                return new CamadaAreaTrechoLogradouro();
            default:
                return new CamadaDefault();
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class GeocoderService {
    /**
     * @param {?} httpClient
     */
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    /**
     * @param {?} longitude
     * @param {?} latitude
     * @param {?} isProduction
     * @return {?}
     */
    recuperaEnderecoPorGeometria(longitude, latitude, isProduction) {
        const /** @type {?} */ pontoWKT = `POINT(${longitude}  ${latitude})`;
        return this.httpClient.get(`${getUrlGeocoder(isProduction)}geocoder/v2/coordinate?ponto=${pontoWKT}`);
    }
    /**
     * @param {?} nomeLogradouro
     * @param {?} numero
     * @param {?} isProduction
     * @return {?}
     */
    recuperaEnderecosPorLogradouro(nomeLogradouro, numero, isProduction) {
        if (!nomeLogradouro) {
            alert('É obrigatório informar o nome do logradouro.');
            return;
        }
        const /** @type {?} */ newEndereco = nomeLogradouro.toLowerCase().replace(filtroEndereco, '');
        nomeLogradouro = newEndereco.toUpperCase().trim();
        let /** @type {?} */ params = `?logradouro=${nomeLogradouro}`;
        if (numero) {
            params += `&numero=${numero}`;
        }
        return this.httpClient.get(`${getUrlGeocoder(isProduction)}geocoder/v2/address${params}`);
    }
    /**
     * @param {?} endereco
     * @param {?} bhMap
     * @return {?}
     */
    zoomEndereco(endereco, bhMap) {
        const /** @type {?} */ latitudeLongitude = this.getPonto(endereco);
        bhMap.centerMap([latitudeLongitude[0], latitudeLongitude[1]]);
    }
    /**
     * @param {?} endereco
     * @return {?}
     */
    getPonto(endereco) {
        const /** @type {?} */ cordenadas = endereco.wkt;
        const /** @type {?} */ busca = 'POINT(';
        const /** @type {?} */ ini = cordenadas.indexOf(busca) + busca.length;
        const /** @type {?} */ fim = cordenadas.indexOf(')', ini);
        const /** @type {?} */ lonLat = cordenadas.substr(ini, fim - ini).split(' ');
        return lonLat;
    }
}
GeocoderService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
GeocoderService.ctorParameters = () => [
    { type: HttpClient, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 *  Componente base que busca as camadas no servidor do bhmaps.
 *  Este componente carrega os callbacks das camadas e suas características específicas de acordo
 *  a classe TipoCamada.ts.
 *  O projeto utiliza o OpenLayers 5 como base.
 *  \@author breno.mcosta
 */
class BhMapComponent {
    /**
     * @param {?} geocoderService
     * @param {?} bhMapService
     */
    constructor(geocoderService, bhMapService) {
        this.geocoderService = geocoderService;
        this.bhMapService = bhMapService;
        // Camadas do bhMaps.
        this.tiposCamadas = [new TipoCamada({ camadaEnum: CamadasEnum.Logradouro, tipoControlePontoEnum: TipoControlePontoEnum.trajeto })];
        // URL do servidor proxy no backend responsável por buscar recursos via https.
        this.urlProxy = 'http://localhost:8080/licenciamento/proxy?server=';
        // Variável de ambiente que determinará as urls do bhMaps (homologação ou produção).
        this.isProduction = false;
        // Objeto de saída.
        this.emitter = new EventEmitter();
        // Enum tipo controle ponto
        this.tipoControlePontoEnum = TipoControlePontoEnum;
        // Componente de espera durante o loading de uma chamada HttpClient
        this.spinkit = Spinkit;
        this.factoryCamada = new FactoryCamada();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
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
     * @return {?}
     */
    carregarCamadas() {
        this.tiposCamadas.forEach((tipoCamada) => {
            this.bhMapService.buscaCamadaBhMap(`${this.bhMap.proxyHost}${this.bhMap.host}${caminhoMetadados}/${tipoCamada.camadaEnum}`).subscribe((layer) => {
                this.bhMap.addLayerWMS(layer, tipoCamada.visivel, tipoCamada.opacidade);
                if (tipoCamada.wfs) {
                    this.bhMap.camadaPrincipal = layer;
                }
            });
        });
    }
    /**
     * Recupera o tipo de controle do ponto (desenho, trajeto, etc), o default é o desenho do ponto.
     * @return {?}
     */
    adicionaControlePonto() {
        this.bhMap.tipoControlePonto = this.factoryCamada.tipoCamadaPrincipal.tipoControlePontoEnum;
        this.draw = new Draw({
            source: this.bhMap.source,
            type: this.bhMap.tipoControlePonto
        });
        const /** @type {?} */ bhMapComponentInstance = this;
        this.bhMap.source.on('addfeature', function (evt) {
            bhMapComponentInstance.abstractCamada.featureAdded(bhMapComponentInstance, evt);
        });
        this.bhMap.map.addInteraction(this.draw);
    }
    /**
     *  Quando for informado o Input painelSelecaoCamadas carrega por default as camadas do Input tiposCamadas no componente painel-selecao-camadas.component.ts.
     *   Também permite adicionar mais camadas ou subcamadas de acordo com a configuração da camadaPrincipal.
     * @return {?}
     */
    adicionaPainelSelecaoCamadas() {
        if (this.painelSelecaoCamadas) {
            this.tiposCamadasSelecaoUsuario = this.abstractCamada.recuperaListaCamadasParaSelecao(this.tiposCamadas);
        }
    }
    /**
     *  Método de zoom in do mapa.
     * @return {?}
     */
    zoomIn() {
        const /** @type {?} */ view = this.bhMap.map.getView();
        const /** @type {?} */ zoom = view.getZoom();
        view.setZoom(zoom + 1);
        return false;
    }
    /**
     *  Método de zoom out do mapa.
     * @return {?}
     */
    zoomOut() {
        const /** @type {?} */ view = this.bhMap.map.getView();
        const /** @type {?} */ zoom = view.getZoom();
        view.setZoom(zoom - 1);
        return false;
    }
    /**
     * @return {?}
     */
    removerPontos() {
        this.bhMap.removerPontos();
        this.bhMap.map.removeInteraction(this.draw);
        this.bhMap.map.addInteraction(this.draw);
    }
    /**
     * @param {?} id
     * @param {?} selecionado
     * @return {?}
     */
    configuraVisibilidade(id, selecionado) {
        const /** @type {?} */ layer = this.bhMap.recuperaCamadaPeloId(id);
        layer.setVisible(selecionado);
    }
    /**
     * Callback para o painel de seleção de camadas.
     * @param {?} camadasSelecionadas
     * @return {?}
     */
    changeCamada(camadasSelecionadas) {
        if (camadasSelecionadas.length && !this.abstractCamada.configuraVisibilidadeEspecifico(camadasSelecionadas, this.bhMap)) {
            camadasSelecionadas.filter(c => c.habilitado).forEach(c => this.configuraVisibilidade(c.camadaEnum, c.selecionado));
        }
    }
    /**
     * Necessário ser no keypress. keyup.enter é tarde demais para evitar a propagação do método (preventDefault() não funciona)
     * @param {?} event
     * @return {?}
     */
    keypressLogradouro(event) {
        if (event.keyCode === 13) {
            return this.buscaLogradouro();
        }
        return true;
    }
    /**
     *  Busca pelo logradouro e número.
     * @return {?}
     */
    buscaLogradouro() {
        this.enderecos = null;
        this.geocoderService.recuperaEnderecosPorLogradouro(this.nomeLogradouro, this.numeroLogradouro, this.isProduction).subscribe(resposta => {
            if (resposta.status !== 'ok') {
                alert('Ocorreu um erro na resposta da pesquisa de endereço, tente novamente mais tarde.');
            }
            else if (resposta.endereco.length === 0) {
                if (this.msgErroEndereco) {
                    alert(this.msgErroEndereco);
                }
                else {
                    alert('Endereço não encontrado.');
                }
            }
            else if (resposta.endereco.length === 1) {
                const /** @type {?} */ endereco = resposta.endereco[0];
                if (!endereco.id) {
                    if (this.msgErroEndereco) {
                        alert(this.msgErroEndereco);
                    }
                    else {
                        alert('Endereço não encontrado.');
                    }
                    return false;
                }
                this.zoomEndereco(endereco);
            }
            else {
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
     * @return {?}
     */
    limparEnderecos() {
        this.enderecos = null;
        return false;
    }
    /**
     * Faz a pesquisa no geocoder pelo o endereço parametrizado e utiliza o openlayers para o zoom do mapa.
     * @param {?} endereco
     * @return {?}
     */
    zoomEndereco(endereco) {
        this.enderecos = null;
        this.geocoderService.zoomEndereco(endereco, this.bhMap);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
    }
}
BhMapComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-bhmap',
                styles: [`.cabecalho{text-align:center;color:#000;font-weight:700;background-color:#d3d3d3;opacity:.8}.btn{border:1px solid transparent;padding:.375rem .75rem;line-height:1.5;cursor:pointer;opacity:.7}.btn-success{color:#fff;background-color:#28a745;border-color:#28a745}.btn-danger{color:#fff;background-color:#c82333;border-color:#bd2130}.btn-lograd{cursor:pointer;border:none;opacity:.7}.btn-lupa{background:url(data:image/gif;base64,R0lGODlhFAAUAPcAAP////7+/vz///39/fb///n///L///z8/Pv7++////r6+vn5+fj4+OL//+H//+D///f3993//9r//9v//9X//9n//9f//9j//9X+//X19dL//9D///T09PPz887+/9H7/8j8//Hx8fDw8O/v78r4/8j4/+7u7s73/+3t7cv2/+zs7NLy/+vr6+rq6unp6cTz/8Xv/+fn5+bm5sHu/+Xl5ePj4+Pi4uLi4sDp/+Hh4eDg4N/f38Lk+97e3t3d3dzc3Lri/Nvb28rg6cje49nZ2NnY19nY2NjY2MHf4djY19fX2NfX19PY4Lbc+6zf/7jd6tbW1q3e/9XV1bDc/9LU1dPT09LS06fb/9HR0dHS08/Pz87Ozs3Nzc7Oze7NZs3NzMvLzPDLZZTV//bHY8nJyMjIyMfHx8TExMXFxMPDxMPDw8HDx8LCwr/CwqbF4r+/v7q9xbe7wrq5uaC7yae6x9i1V7S1tf2pSrSzsbmxr6O3uqa1xP+lR6+yt7Cxsa2wsrCvra+vr6uvsfehRauqqq2qnZSszqmmnKeil5ygw5+dnIufrZeXl8qMYZeVlZWSnbaLfo2UnJSSkcuGXJGRkpWRj4STr4WRtJCQkJGRjZOQjJOOipGOi5CMko2Mi4uLi4mIioqHhXyJkYaFh6p9dIaEgqV5dn2DhYGAfqJ4dH9+f3J/lHh+hnt7fnp4eHd3e3d2dml5gWp5gnd1e3h0cGV3fnRzd21yh3BvbnBubWlueGdnZ2Rma2FmdFphZldeYV1bXlpZV1pYWFpWVlRUUVNSUFRST1NPS01MSkxJSUpIS0lJSExHRTg3NgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAQUAP8ALAAAAAAUABQAAAj/AAEIHEiwoEGDDFTokKKl4ZEaIxQcFGjixxY/pTZtkrPlRggEB0dYzOUqEp09rzx9uSHCIIIaWFDxYvLAA4gnt0KRqQGhoIgggFoJAbDiSpQTPHrhkcKioAorkkRVwDFlxokTGAzZ6kKjIIsujxKVEANDggYNEtwAO7PDK5lOlig4+XAhQQIHeoSd6UEQAQ01mVY1eUEigoDDp4Kl8THwwIgifTjRugTEgoUGBNoo27WlKwDHROIgqjNpFqs5SIYsajbqTRIUABCMIALnUJg7kH4dYzYsWTFYgaCw4AAgg401hbzwSSVrmSpQoDAR2rLExQKKVPKMGWQqFjJKdtiUTtGy5AYKCAECADCRpVIjUrWMMUJTRYeMFi0WqB9owoggXb4Q44gZR4wA0kQcyKDFH7goAkaBB0w0UAcxJGFhDiNEKKFAB2QgwociSLRhQAA7);height:21px;width:21px;padding:6px}.btn-fechar{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAG1BMVEUAAADbVWHfUF/gT1/fT13fT1/gT1/gT18AAADzuIw9AAAAB3RSTlMAFbrWN9LwcKApFAAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfgCxkRDyO4SjzcAAAAU0lEQVQI12NgVHZgYGAxEmAQLU9hYHArD2RQLy9zYEkvL2IwLy9PcSsvLwaKlpelAzkMQGEgKHMAKSwHCTCAhUACCAZMCq4Yrh1uINwKuKUwZwAA6eEm66TvjNYAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTYtMTEtMjVUMTc6MTU6MzUrMDE6MDC3uE8LAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE2LTExLTI1VDE3OjE1OjM1KzAxOjAwxuX3twAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII=);height:16px;width:15px}.div-salvar{position:absolute;margin-right:55px;margin-bottom:200px;bottom:0;right:0;z-index:20000}.div-remover-pontos{position:absolute;margin-right:55px;margin-bottom:150px;bottom:0;right:0;z-index:20000}.div-camadas{position:absolute;overflow-y:auto;top:180px;border:1px solid #000;background-color:#d3d3d3;opacity:.8}.div-remove-pontos{position:absolute;top:150px}.div-pesquisa-logradouro{position:absolute;left:90px;top:10px;z-index:20000}.div-endereco{position:absolute;left:90px;top:66px;opacity:.9;z-index:20000;height:200px;overflow:auto}.tabela-pesquisa-logradouro{border:1px solid gray}.tabela-endereco{background-color:#d3d3d3;z-index:999;border:1px solid #000;cursor:pointer}.tabela-endereco>tbody>tr:nth-of-type(even){background-color:#f9f9f9}::-webkit-scrollbar{width:12px}::-webkit-scrollbar-track{-webkit-box-shadow:inset 0 0 6px rgba(0,0,0,.3);border-radius:10px}::-webkit-scrollbar-thumb{border-radius:10px;-webkit-box-shadow:inset 0 0 6px rgba(0,0,0,.5)}.logoBHMap{position:absolute;bottom:10px;right:10px;z-index:20000;background-image:url(data:image/png;base64,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);background-repeat:no-repeat;background-position:center center;background-size:contain;width:64px;height:18px}.BHMapZoomBox{z-index:20000;position:absolute;left:0;top:20px}.BHMapZoomBoxMinus a:hover,.BHMapZoomBoxPlus a:hover{-webkit-box-shadow:0 2px 8px rgba(0,0,0,.3),0 -1px 0 rgba(0,0,0,.03);box-shadow:0 2px 8px rgba(0,0,0,.3),0 -1px 0 rgba(0,0,0,.03)}.BHMapZoomBoxPlus a{position:absolute;left:10px;top:7px;width:25px;height:25px;margin:0;padding:0;background-color:#fafafa;border-radius:1px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAMAAADXT/YiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkUwRTZCRkI3NjQzNzExRTBBQUI3RTAwMUU2MTZDRkQ5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkUwRTZCRkI4NjQzNzExRTBBQUI3RTAwMUU2MTZDRkQ5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTBFNkJGQjU2NDM3MTFFMEFBQjdFMDAxRTYxNkNGRDkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTBFNkJGQjY2NDM3MTFFMEFBQjdFMDAxRTYxNkNGRDkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7cwPMXAAAABlBMVEUAAAD///+l2Z/dAAAAAnRSTlP/AOW3MEoAAAAZSURBVHjaYmBkZGRgYACR2Fj4AV69AAEGAAauACW68QgkAAAAAElFTkSuQmCC);background-repeat:no-repeat;background-position:center center;outline:0;border:none;-webkit-box-shadow:0 2px 4px rgba(0,0,0,.2),0 -1px 0 rgba(0,0,0,.02);box-shadow:0 2px 4px rgba(0,0,0,.2),0 -1px 0 rgba(0,0,0,.02)}.BHMapZoomBoxMinus a{position:absolute;left:10px;top:34px;width:25px;height:25px;margin:0;padding:0;background-color:#fafafa;border-radius:1px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAMAAADXT/YiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkU5MjRDMEQ5NjQzNzExRTBCM0JDQkU2MzVGQTBCNjRDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkU5MjRDMERBNjQzNzExRTBCM0JDQkU2MzVGQTBCNjRDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTkyNEMwRDc2NDM3MTFFMEIzQkNCRTYzNUZBMEI2NEMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTkyNEMwRDg2NDM3MTFFMEIzQkNCRTYzNUZBMEI2NEMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7uh53jAAAABlBMVEUAAAD///+l2Z/dAAAAAnRSTlP/AOW3MEoAAAAVSURBVHjaYmCEAQZsLPwAr16AAAMACdgAN9MxY1IAAAAASUVORK5CYII=);background-repeat:no-repeat;background-position:center center;outline:0;border:none;-webkit-box-shadow:0 2px 4px rgba(0,0,0,.2),0 -1px 0 rgba(0,0,0,.02);box-shadow:0 2px 4px rgba(0,0,0,.2),0 -1px 0 rgba(0,0,0,.02)}`],
                template: `
<spinner [backgroundColor]="'#64676b'" [spinner]="spinkit.skThreeBounce" [debounceDelay]="200">
</spinner>

<!-- Controles de zoom do mapa-->
<div class="BHMapZoomBox">
  <div class="BHMapZoomBoxPlus">
     <a href="#" (click)="zoomIn()"></a>
   </div>
   <div class="BHMapZoomBoxMinus">
      <a href="#" (click)="zoomOut()"></a>
  </div>
</div>

<!-- Div que renderiza o mapa

  
<div id="BHMap" style="height: 98vH; width: 99vW; -webkit-box-flex: 0; -ms-flex: 0 0 100%; flex: 0 0 100%;max-width: 100%;"></div> -->
 

<div id="map" class="map" style="height: 98vH; width: 99vW; -webkit-box-flex: 0; -ms-flex: 0 0 100%; flex: 0 0 100%;max-width: 100%;"></div>


<!--Pesquisa por logradouros.-->

<div class="div-pesquisa-logradouro">
 <table class="tabela-pesquisa-logradouro">
   <tr>
     <td class="cabecalho"><label for="nomeLogradouro">Logradouro</label>
     </td>
   </tr>
   <tr>
     <td>
       <input type="text" [(ngModel)]="nomeLogradouro" style="width: 180px;" placeholder="Digite o endereço" (keypress)="keypressLogradouro($event)"  />
       <input type="number" [(ngModel)]="numeroLogradouro" style="width: 50px;" min="1" placeholder="Nº" (keypress)="keypressLogradouro($event)"  />
       <button (click)="buscaLogradouro()" type="button" class="btn-lograd btn-lupa" title="Pesquisar"></button>
     </td>
   </tr>
 </table>
</div>

<!-- Grid de resultado pesquisa logradouros -->

<div class="div-endereco">
 <table class="tabela-endereco" *ngIf="enderecos && enderecos.length > 1">
   <tr>
     <td style="text-align:right">
       <button (click)="limparEnderecos()" class="btn-lograd btn-fechar" type="button" title="Fechar"></button>	
     </td>
   </tr>
   <tr *ngFor="let endereco of enderecos" (click)=zoomEndereco(endereco)>
     <td> {{endereco.tipologradouro}} {{endereco.nomelogradouro}} , BAIRRO {{endereco.bairropopular | uppercase}}
     </td>
   </tr>
 </table>
</div>

<!--Componente de camadas / profundidades.-->

<ng-container *ngIf="tiposCamadasSelecaoUsuario">
  <app-painel-selecao-camadas id="camadas" [(ngModel)]="tiposCamadasSelecaoUsuario" (change)="changeCamada($event)" ></app-painel-selecao-camadas>
</ng-container>

<div class="div-remover-pontos">
 <button type="button" class="btn btn-danger" (click)="removerPontos()">Remover pontos</button>
</div>



<div class="logoBHMap"> </div>`
            },] },
];
/** @nocollapse */
BhMapComponent.ctorParameters = () => [
    { type: GeocoderService, },
    { type: BhMapService, },
];
BhMapComponent.propDecorators = {
    "tiposCamadas": [{ type: Input },],
    "urlProxy": [{ type: Input },],
    "isProduction": [{ type: Input },],
    "emitter": [{ type: Output },],
    "painelSelecaoCamadas": [{ type: Input },],
    "msgErroEndereco": [{ type: Input },],
    "zoomMaximo": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/** @enum {string} */
const WorspaceCamadaEnum = {
    BhGeo: 'ide_bhgeo',
    Sirgas: 'pbh_sirgas',
    PbhBase: 'pbh_base',
};
/**
 * @param {?} camadaEnum
 * @return {?}
 */
function getWorkspaceByCamada(camadaEnum) {
    switch (camadaEnum) {
        case CamadasEnum.Endereco:
        case CamadasEnum.Logradouro:
        case CamadasEnum.Parque:
        case CamadasEnum.PatrimonioCultural:
        case CamadasEnum.Praca: {
            return WorspaceCamadaEnum.BhGeo;
        }
        case CamadasEnum.AreaTrechoLogradouro: {
            return WorspaceCamadaEnum.Sirgas;
        }
        case CamadasEnum.ObraLogradouro: {
            return WorspaceCamadaEnum.PbhBase;
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 *  Service que retorna uma imagem do servidor de backend do bhmaps (goserver) de acordo com  um filtro (cql_filter) e uma camada.
 *  \@author breno.mcosta
 */
class BhMapImageService {
    /**
     * @param {?} httpClient
     * @param {?} bhMapService
     */
    constructor(httpClient, bhMapService) {
        this.httpClient = httpClient;
        this.bhMapService = bhMapService;
    }
    /**
     *  Registra varíaveis e urls.
     * @param {?} urlProxy
     * @param {?} isProduction
     * @param {?} camadasEnum
     * @return {?}
     */
    registraVariaveis(urlProxy, isProduction, camadasEnum) {
        this.proxyHost = urlProxy;
        this.urlBhMap = getUrlBhMap(isProduction);
        this.workspaceBase = `${getWorkspaceByCamada(camadasEnum[0])}`;
        this.urlCamadas = getUrlCamadas(isProduction);
        if (this.workspaceBase === WorspaceCamadaEnum.Sirgas) {
            this.nomeMapaBase = 'S2000_BHBASE';
            this.sirgas = true;
        }
        else {
            this.nomeMapaBase = 'MAPA_BASE';
            this.sirgas = false;
        }
    }
    /**
     *  Recupera as geometrias e a imagem de acordo com os parâmetros informados.
     * @param {?} urlProxy - URL do servidor proxy no backend responsável por buscar recursos via https..
     * @param {?} isProduction - Variável que define se as urls do bhmaps seram de homologação ou produção.
     * @param {?} camadasEnum  - Array de camadas que serão adicionadas com a camada base para geração da imagem, a primeira camada deve ser a mesma do cqlFilter. Ver CamadasEnum.ts.
     * @param {?} cqlFilter  - Filtro para recuperação das geometrias da camada, mais detalhes em https://wiki.state.ma.us/display/massgis/GeoServer+-+CQL
     * @param {?=} largura - Largura da imagem, argumento com valor default 800px.
     * @param {?=} altura - Largura da imagem, argumento com valor default 600px.
     * @param {?=} buffer - Buffer para cálculo da área da imagem, após a concatenação das geometrias esse valor é aplicado para dar um zoom melhor na imagem. Quanto maior o valor do buffer menor será o zoom da imagem, argumento com valor default 100
     * @return {?}
     */
    getGeometriasEImagem(urlProxy, isProduction, camadasEnum, cqlFilter, largura = 800, altura = 600, buffer = 100) {
        this.registraVariaveis(urlProxy, isProduction, camadasEnum);
        return new Observable((observer) => {
            if (!cqlFilter) {
                observer.next();
                observer.complete();
                return;
            }
            const /** @type {?} */ cqlFilterGeometria = this.aplicaFiltroEspecificoParaGeometria(cqlFilter, camadasEnum);
            const /** @type {?} */ typename = `${this.workspaceBase}:${this.sirgas ? 'S2000_' : ''}${camadasEnum[0].toUpperCase()}`;
            this.bhMapService.getFeature(typename, cqlFilterGeometria, this.proxyHost, this.urlBhMap).pipe(mergeMap(json => {
                const /** @type {?} */ features = new GeoJSON().readFeatures(json);
                const /** @type {?} */ geometrias = features.map((ponto) => {
                    return { geometry: ponto.geometry };
                });
                return this.getImagem(urlProxy, isProduction, camadasEnum, geometrias, cqlFilter, largura, altura, buffer);
            })).subscribe(arrayBuffer => {
                observer.next(arrayBuffer);
                observer.complete();
            }, (error) => {
                console.error(error);
                // Retorna vazio para não causar erro na aplicação chamadora.
                observer.next();
                observer.complete();
            });
        });
    }
    /**
     *  Recupera a imagem de acordo com os parâmetros informados.
     * @param {?} urlProxy - URL do servidor proxy no backend responsável por buscar recursos via https..
     * @param {?} isProduction - Variável que define se as urls do bhmaps seram de homologação ou produção.
     * @param {?} camadasEnum  - Array de camadas que serão adicionadas com a camada base para geração da imagem, a primeira camada deve ser a mesma do cqlFilter. Ver CamadasEnum.ts.
     * @param {?} geometrias - geometrias dos pontos caso já existam.
     * @param {?} cqlFilter  - Filtro para recuperação das geometrias da camada, mais detalhes em https://wiki.state.ma.us/display/massgis/GeoServer+-+CQL
     * @param {?=} largura - Largura da imagem, argumento com valor default 800px.
     * @param {?=} altura - Largura da imagem, argumento com valor default 600px.
     * @param {?=} buffer - Buffer para cálculo da área da imagem, após a concatenação das geometrias esse valor é aplicado para dar um zoom melhor na imagem. Quanto maior o valor do buffer menor será o zoom da imagem, argumento com valor default 100
     * @return {?}
     */
    getImagem(urlProxy, isProduction, camadasEnum, geometrias, cqlFilter, largura = 800, altura = 600, buffer = 100) {
        if (!this.workspaceBase) {
            this.registraVariaveis(urlProxy, isProduction, camadasEnum);
        }
        const /** @type {?} */ parametros = {
            service: 'WMS',
            version: '1.1.0',
            request: 'GetMap',
            srs: epsg,
            format: 'image/png',
            layers: `${this.workspaceBase}:${this.nomeMapaBase},${camadasEnum.map(camadaEnum => `${getWorkspaceByCamada(camadaEnum)}:${this.sirgas ? 'S2000_' : ''}${camadaEnum.toUpperCase()}`).join(',')}`,
            bbox: `${calculaAreaImagemPorGeometrias(geometrias, buffer)}`,
            width: largura,
            height: altura,
            cql_filter: `include;${cqlFilter}`
        };
        return new Observable((observer) => this.httpClient.get(`${this.proxyHost}${this.urlCamadas}${this.workspaceBase}/wms?${concatInQueryParams(parametros)}`, { responseType: 'arraybuffer' }).subscribe(blob => {
            observer.next(blob);
            observer.complete();
        }, (error) => {
            console.error(error);
            observer.error(error);
        }));
    }
    /**
     *  Aplica um filtro específico caso o filtro da recuperação da geometria seja diferente da imagem.
     * @param {?} cqlFilter
     * @param {?} camadasEnum
     * @return {?}
     */
    aplicaFiltroEspecificoParaGeometria(cqlFilter, camadasEnum) {
        // No caso da camada de obra o filtro pelo COD_PROFUNDIDADE é feito apenas na query de imagem e não na de geometria.
        if (camadasEnum.find(c => c === CamadasEnum.ObraLogradouro)) {
            return cqlFilter.split(';')[0];
        }
        return cqlFilter;
    }
}
BhMapImageService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
BhMapImageService.ctorParameters = () => [
    { type: HttpClient, },
    { type: BhMapService, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class PainelSelecaoCamadasComponent {
    constructor() {
        this.change = new EventEmitter();
        this.camadas = new Array();
        this.propagateChange = (_) => { };
    }
    /**
     * @return {?}
     */
    get model() {
        return this.camadas;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set model(value) {
        this.camadas = value;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        if (value !== undefined) {
            this.camadas = value;
        }
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    /**
     * @return {?}
     */
    registerOnTouched() { }
    /**
     * Retorna todas as camadas selecionadas mais o valor da camada corrente, que pode ser selecionado ou não selecionado
     * para aplicar a visibilidade.
     * @param {?} camadaCorrente
     * @return {?}
     */
    onChange(camadaCorrente) {
        const /** @type {?} */ camadasResultantes = this.camadas.filter(c => c.selecionado && c.id !== camadaCorrente.id);
        camadasResultantes.push(camadaCorrente);
        this.change.emit(camadasResultantes);
    }
}
PainelSelecaoCamadasComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-painel-selecao-camadas',
                styles: [`.div-camadas{position:absolute;overflow-y:auto;top:180px;border:1px solid #000;background-color:#d3d3d3;opacity:.8;z-index:20000}`],
                template: `<div class="div-camadas">

    <div style="text-align: center;padding-top: 5px;"><b>Visualizar</b></div>


    <div style="margin:5px;">

        <div *ngFor="let c of camadas">
            <input type="checkbox" [id]="c.nome" [(ngModel)]="c.selecionado" #ckb="ngModel" [disabled]="!c.habilitado"
                (change)="onChange(c)" />
            <label [for]="c.nome">{{ c.descricao }}</label>
        </div>

    </div>
</div>`,
                providers: [{
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => PainelSelecaoCamadasComponent),
                        multi: true
                    }]
            },] },
];
/** @nocollapse */
PainelSelecaoCamadasComponent.propDecorators = {
    "change": [{ type: Output },],
    "model": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class BhMapModule {
}
BhMapModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    BhMapComponent,
                    PainelSelecaoCamadasComponent
                ],
                imports: [
                    CommonModule,
                    FormsModule,
                    NgHttpLoaderModule
                ],
                exports: [
                    BhMapComponent
                ],
                providers: [
                    GeocoderService,
                    BhMapService,
                    BhMapImageService
                ]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { ObjetoOutputMapa, CamadasEnum, TipoControlePontoEnum, TipoCamada, BhMapComponent, BhMapImageService, BhMapModule, PainelSelecaoCamadasComponent as ɵc, BhMapService as ɵb, GeocoderService as ɵa };
//# sourceMappingURL=bhmap.js.map

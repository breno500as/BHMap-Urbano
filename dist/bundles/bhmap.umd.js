(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ol/layer/Tile'), require('ol/layer/Vector'), require('ol/Map'), require('ol/source/TileWMS'), require('ol/proj/proj4'), require('ol/source/Vector'), require('ol/View'), require('ol/tilegrid/TileGrid'), require('proj4'), require('@angular/common/http'), require('@angular/core'), require('ol/format/GeoJSON'), require('ng-http-loader/spinkits'), require('ol/interaction/Draw'), require('rxjs/Observable'), require('rxjs/operators'), require('@angular/forms'), require('@angular/common'), require('ng-http-loader/ng-http-loader.module')) :
	typeof define === 'function' && define.amd ? define('bhmap', ['exports', 'ol/layer/Tile', 'ol/layer/Vector', 'ol/Map', 'ol/source/TileWMS', 'ol/proj/proj4', 'ol/source/Vector', 'ol/View', 'ol/tilegrid/TileGrid', 'proj4', '@angular/common/http', '@angular/core', 'ol/format/GeoJSON', 'ng-http-loader/spinkits', 'ol/interaction/Draw', 'rxjs/Observable', 'rxjs/operators', '@angular/forms', '@angular/common', 'ng-http-loader/ng-http-loader.module'], factory) :
	(factory((global.bhmap = {}),global.TileLayer,global.VectorLayer,global.Map,global.TileWMS,global.proj4,global.VectorSource,global.View,global.TileGrid,global.proj4x__default,global.ng.common.http,global.ng.core,global.GeoJSON,global.spinkits,global.Draw,global.Rx,global.Rx.Observable.prototype,global.ng.forms,global.ng.common,global.ngHttpLoader_module));
}(this, (function (exports,TileLayer,VectorLayer,Map,TileWMS,proj4,VectorSource,View,TileGrid,proj4x__default,http,core,GeoJSON,spinkits,Draw,Observable,operators,forms,common,ngHttpLoader_module) { 'use strict';

TileLayer = TileLayer && TileLayer.hasOwnProperty('default') ? TileLayer['default'] : TileLayer;
VectorLayer = VectorLayer && VectorLayer.hasOwnProperty('default') ? VectorLayer['default'] : VectorLayer;
Map = Map && Map.hasOwnProperty('default') ? Map['default'] : Map;
TileWMS = TileWMS && TileWMS.hasOwnProperty('default') ? TileWMS['default'] : TileWMS;
VectorSource = VectorSource && VectorSource.hasOwnProperty('default') ? VectorSource['default'] : VectorSource;
View = View && View.hasOwnProperty('default') ? View['default'] : View;
TileGrid = TileGrid && TileGrid.hasOwnProperty('default') ? TileGrid['default'] : TileGrid;
proj4x__default = proj4x__default && proj4x__default.hasOwnProperty('default') ? proj4x__default['default'] : proj4x__default;
GeoJSON = GeoJSON && GeoJSON.hasOwnProperty('default') ? GeoJSON['default'] : GeoJSON;
Draw = Draw && Draw.hasOwnProperty('default') ? Draw['default'] : Draw;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0
THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.
See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */
var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};
function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var ObjetoOutputMapa = /** @class */ (function () {
    function ObjetoOutputMapa() {
    }
    return ObjetoOutputMapa;
}());
var CamadasEnum = {
    AreaTrechoLogradouro: 'area_trecho_logradouro',
    ObraLogradouro: 'obra_logradouro',
    Endereco: 'endereco',
    Logradouro: 'trecho_logradouro',
    Parque: 'parque',
    Praca: 'praca',
    PatrimonioCultural: 'a_definir',
};
var TipoControlePontoEnum = {
    ponto: 'Point',
    trajeto: 'LineString',
    poligono: 'Polygon',
    circle: 'Circle',
};
var TipoCamada = /** @class */ (function () {
    function TipoCamada(params) {
        if (params === void 0) { params = ({}); }
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
    return TipoCamada;
}());
var filtroEndereco = /rua\s+|avenida\s+|praca\s+|praça\s+|ave\s+|av.\s+|ave.\s+/gi;
var idAreaTrechoLogradouro = 'ID_AREA_TRECHO_LOGRADOURO';
var caminhoMetadados = 'v2/api/metacamada';
var epsg = 'EPSG:31983';
function formataEndereco(endereco) {
    return endereco.tipologradouro + " " + endereco.nomelogradouro + " , N\u00BA " + endereco.numero;
}
function concatInQueryParams(queryFilterObject) {
    return Object.keys(queryFilterObject).map(function (key) { return key + "=" + queryFilterObject[key]; }).join('&');
}
function getUrlBhMap(isProduction) {
    if (isProduction) {
        return 'http://bhmap.pbh.gov.br/';
    }
    return 'http://bhmap-hm.pbh.gov.br/';
}
function getUrlCamadas(isProduction) {
    if (isProduction) {
        return 'http://bhmapogcbase.pbh.gov.br/bhmapogcbase/';
    }
    return 'http://bhmapogcbase-hm.pbh.gov.br/bhmapogcbase/';
}
function getUrlGeocoder(isProduction) {
    if (isProduction) {
        return 'http://geocoder.pbh.gov.br/';
    }
    return 'http://geocoder-hm.pbh.gov.br/';
}
function distinctArrayByProperty(array, prop) {
    return array.reduce(function (currentArray, item) {
        if (!currentArray.find(function (currentItem) { return currentItem[prop] === item[prop]; })) {
            currentArray.push(item);
        }
        return currentArray;
    }, []);
}
function calculaAreaImagemPorGeometrias(geometrias, buffer) {
    var layers = new window['nomeObjetoOpenLayers'].Geometry.Collection();
    geometrias.forEach(function (geometria) {
        layers.addComponent(geometria.geometry);
    });
    layers.calculateBounds();
    var oldBB = layers.getBounds();
    var newBB = new window['nomeObjetoOpenLayers'].Bounds(oldBB.left - buffer, oldBB.bottom - buffer, oldBB.right + buffer, oldBB.top + buffer);
    return newBB;
}
var BhMap = /** @class */ (function () {
    function BhMap(urlProxy, isProduction) {
        this.idsJaAdicionados = [];
        this.objetosDistintos = [];
        this.layers = new Array();
        this.proxyHost = urlProxy;
        this.host = getUrlBhMap(isProduction);
        this.urlCamadas = getUrlCamadas(isProduction);
        this.configMap();
    }
    BhMap.prototype.configuraProjecao = function () {
        var proj4$$1 = proj4x__default;
        proj4$$1.defs(epsg, '+proj=utm +zone=23 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
        proj4$$1.defs('WGS84', '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees');
        proj4.register(proj4$$1);
    };
    BhMap.prototype.configMap = function () {
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
    };
    BhMap.prototype.addBaseLayerWMS = function () {
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
    };
    BhMap.prototype.addLayerWMS = function (layer, visivel, opacidade) {
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
            zIndex: layer.id,
            visible: visivel
        }));
    };
    BhMap.prototype.createMap = function () {
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
    };
    BhMap.prototype.centerMap = function (cordenadas) {
        this.map.getView().setCenter(cordenadas);
        this.map.getView().setZoom(8);
    };
    BhMap.prototype.recuperaCamadaPeloId = function (caminho) {
        var l = null;
        this.map.getLayers().forEach(function (layer) {
            if (caminho === layer.get('zIndex')) {
                l = layer;
            }
        });
        return l;
    };
    BhMap.prototype.removeUltimoPonto = function () {
        if (this.ultimoPontoAdicionado) {
            this.source.removeFeature(this.ultimoPontoAdicionado.feature);
            this.ultimoPontoAdicionado = null;
        }
    };
    BhMap.prototype.removerPontos = function () {
        this.idsJaAdicionados = [];
        this.source.clear();
    };
    return BhMap;
}());
var BhMapService = /** @class */ (function () {
    function BhMapService(httpClient) {
        this.httpClient = httpClient;
    }
    BhMapService.prototype.buscaCamadaBhMap = function (caminho) {
        return this.httpClient.get(caminho);
    };
    BhMapService.prototype.getFeatureDataWFS = function (coordenadas, bhMap) {
        var camadaPrincipal = bhMap.camadaPrincipal;
        var pixel = bhMap.map.getPixelFromCoordinate(coordenadas);
        var objetoPontoGeometria = { x: pixel[0], y: pixel[1] };
        var raioBusca = 1;
        if (camadaPrincipal.servicos.wfs.raiobusca) {
            raioBusca = camadaPrincipal.servicos.wfs.raiobusca;
        }
        var lowerPixel = Object.assign({}, objetoPontoGeometria);
        lowerPixel.x -= raioBusca;
        lowerPixel.y += raioBusca;
        var lowerCoordinates = bhMap.map.getCoordinateFromPixel([lowerPixel.x, lowerPixel.y]);
        var upperPixel = Object.assign({}, objetoPontoGeometria);
        upperPixel.x += raioBusca;
        upperPixel.y -= raioBusca;
        var upperCoordinates = bhMap.map.getCoordinateFromPixel([upperPixel.x, upperPixel.y]);
        return this.httpClient.get("" + bhMap.proxyHost + camadaPrincipal.servicos.wfs.url + "?" + this.getQueryParams(camadaPrincipal, lowerCoordinates, upperCoordinates));
    };
    BhMapService.prototype.getQueryParams = function (camadaPrincipal, lowerCoordinates, upperCoordinates) {
        var queryFilterObject = {
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
    };
    BhMapService.prototype.getFeature = function (typeName, cqlFilterGeometria, proxyHost, urlBhMap) {
        var parametros = {
            version: '2.0',
            request: 'GetFeature',
            typeName: typeName,
            outputFormat: 'application/json',
            CQL_FILTER: "" + cqlFilterGeometria
        };
        return this.httpClient.get("" + proxyHost + urlBhMap + "v2/api/wfs?" + concatInQueryParams(parametros));
    };
    return BhMapService;
}());
BhMapService.decorators = [
    { type: core.Injectable },
];
BhMapService.ctorParameters = function () { return [
    { type: http.HttpClient, },
]; };
var AbstractCamada = /** @class */ (function () {
    function AbstractCamada() {
    }
    AbstractCamada.prototype.recuperaListaCamadasParaSelecao = function (tiposCamadas) {
        return tiposCamadas;
    };
    AbstractCamada.prototype.configuraVisibilidadeEspecifico = function (camadasSelecionadas, bhMap) {
        return false;
    };
    AbstractCamada.prototype.featureAddedWFS = function (bhMapComponentInstance, ponto) {
        var _this = this;
        bhMapComponentInstance.bhMap.ultimoPontoAdicionado = ponto;
        var coordenadas = ponto.feature.getGeometry().getCoordinates();
        if (bhMapComponentInstance.bhMap.tipoControlePonto === TipoControlePontoEnum.ponto) {
            this.getFeatureDataWFS(bhMapComponentInstance, coordenadas);
        }
        else {
            bhMapComponentInstance.bhMap.numeroTotalPontos = coordenadas.length;
            bhMapComponentInstance.bhMap.posicaoPonto = 1;
            coordenadas.forEach(function (coordenada) {
                _this.getFeatureDataWFS(bhMapComponentInstance, coordenada);
            });
        }
    };
    AbstractCamada.prototype.getFeatureDataWFS = function (bhMapComponentInstance, coordenadas) {
        var _this = this;
        bhMapComponentInstance.bhMapService.getFeatureDataWFS(coordenadas, bhMapComponentInstance.bhMap).subscribe(function (json) {
            var features = new GeoJSON().readFeatures(json);
            var results = features ? features.map(function (feature) { return Object.assign({}, feature.values_); }) : [];
            _this.executaCallback(results, bhMapComponentInstance, bhMapComponentInstance.emitter);
        });
    };
    return AbstractCamada;
}());
var CamadaAreaTrechoLogradouro = /** @class */ (function (_super) {
    __extends(CamadaAreaTrechoLogradouro, _super);
    function CamadaAreaTrechoLogradouro() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CamadaAreaTrechoLogradouro.prototype.featureAdded = function (bhMapComponentInstance, ponto) {
        _super.prototype.featureAddedWFS.call(this, bhMapComponentInstance, ponto);
    };
    CamadaAreaTrechoLogradouro.prototype.executaCallback = function (objetoArr, bhMapComponentInstance, ponto) {
        var bhMap = bhMapComponentInstance.bhMap;
        if (objetoArr.length === 0 && bhMap.ultimoPontoAdicionado) {
            bhMap.removeUltimoPonto();
            return;
        }
        objetoArr.forEach(function (objetoRetorno) {
            var id = objetoRetorno[idAreaTrechoLogradouro];
            if (bhMap.idsJaAdicionados && bhMap.idsJaAdicionados.find(function (idJaAdicionado) { return idJaAdicionado.id === objetoRetorno[idAreaTrechoLogradouro]; })) {
                bhMap.removeUltimoPonto();
                return;
            }
            bhMap.idsJaAdicionados.push({ id: id, ponto: bhMap.ultimoPontoAdicionado, geometry: objetoRetorno.geometry });
            var objetoOutputMapa = new ObjetoOutputMapa();
            objetoOutputMapa.objetosRetorno = [{ id: id, ponto: ponto }];
            bhMapComponentInstance.emitter.emit(objetoOutputMapa);
        });
    };
    CamadaAreaTrechoLogradouro.prototype.configuraVisibilidadeEspecifico = function (camadasSelecionadas, bhMap) {
        var layer = bhMap.recuperaCamadaPeloId(CamadasEnum.ObraLogradouro);
        var resultado = camadasSelecionadas.filter(function (c) { return c.habilitado && c.selecionado; }).map(function (c) { return "COD_PROFUNDIDADE=" + c.id; }).join(' OR ');
        if (resultado.length > 0) {
            layer.setVisible(true);
            layer.getSource().updateParams({ 'CQL_FILTER': resultado });
        }
        else {
            layer.setVisible(false);
        }
        return true;
    };
    CamadaAreaTrechoLogradouro.prototype.recuperaListaCamadasParaSelecao = function (tiposCamadas) {
        var array = new Array().concat(tiposCamadas);
        array.push(new TipoCamada({ camadaEnum: CamadasEnum.ObraLogradouro, id: 2, descricao: 'Obras 1 a 2 metros' }));
        array.push(new TipoCamada({ camadaEnum: CamadasEnum.ObraLogradouro, id: 3, descricao: 'Obras 2 a 3 metros' }));
        array.push(new TipoCamada({ camadaEnum: CamadasEnum.ObraLogradouro, id: 4, descricao: 'Obras 3 a 4 metros' }));
        array.push(new TipoCamada({ camadaEnum: CamadasEnum.ObraLogradouro, id: 5, descricao: 'Obras acima de 4 metros' }));
        array.push(new TipoCamada({ camadaEnum: CamadasEnum.ObraLogradouro, id: 6, descricao: 'Obras aéreas' }));
        array.push(new TipoCamada({ camadaEnum: CamadasEnum.ObraLogradouro, id: 7, descricao: 'Obras sobre a superfície' }));
        return array;
    };
    return CamadaAreaTrechoLogradouro;
}(AbstractCamada));
var CamadaEndereco = /** @class */ (function (_super) {
    __extends(CamadaEndereco, _super);
    function CamadaEndereco() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CamadaEndereco.prototype.executaCallback = function (objetoArr, bhMapComponentInstance) {
    };
    CamadaEndereco.prototype.featureAdded = function (bhMapComponentInstance, ponto) {
        var coordenadas = ponto.feature.getGeometry().getCoordinates();
        bhMapComponentInstance.bhMap.ultimoPontoAdicionado = ponto;
        bhMapComponentInstance.geocoderService.recuperaEnderecoPorGeometria(coordenadas[0], coordenadas[1], bhMapComponentInstance.isProduction).subscribe(function (resposta) {
            var endereco = resposta.endereco[0];
            if (!endereco.id) {
                alert('Não foi encontrado um endereço para o ponto selecionado!');
                bhMapComponentInstance.bhMap.removeUltimoPonto();
                return;
            }
            var enderecoFormatado = formataEndereco(endereco);
            if (confirm("Confirma a sele\u00E7\u00E3o do endere\u00E7o: \"" + enderecoFormatado + "\" ?")) {
                bhMapComponentInstance.emitter.emit({ objetosRetorno: [endereco] });
            }
            else {
                bhMapComponentInstance.bhMap.removeUltimoPonto();
            }
        }, (function (resposta) {
            bhMapComponentInstance.bhMap.removeUltimoPonto();
            alert('Ocorreu um erro ao recupera o endereço. Tente novamente mais tarde.');
            console.error(resposta.error.detalhes);
        }));
    };
    return CamadaEndereco;
}(AbstractCamada));
var CamadaLogradouro = /** @class */ (function (_super) {
    __extends(CamadaLogradouro, _super);
    function CamadaLogradouro() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CamadaLogradouro.prototype.executaCallback = function (objetoArr, bhMapComponentInstance, ponto) {
        var bhMap = bhMapComponentInstance.bhMap;
        var isPonto = bhMap.tipoControlePonto === TipoControlePontoEnum.ponto;
        if (objetoArr.length === 0) {
            alert('Logradouro não encontrado');
            isPonto ? bhMap.removeUltimoPonto() : bhMap.removerPontos();
        }
        else if (objetoArr.length > 10) {
            alert('Seleção de trajeto inválida, aproxime mais o mapa para escolha do trajeto');
            bhMap.removerPontos();
        }
        else {
            var logradourosDistintos = distinctArrayByProperty(objetoArr, 'ID_LOGRADOURO');
            var arrayConcat = logradourosDistintos.concat(bhMap.objetosDistintos);
            bhMap.objetosDistintos = distinctArrayByProperty(arrayConcat, 'ID_LOGRADOURO');
            if ((bhMap.posicaoPonto === bhMap.numeroTotalPontos) || isPonto) {
                var arrayOrdenado = bhMap.objetosDistintos.reverse();
                var msg = arrayOrdenado.map(function (logradouro) { return "\"" + logradouro.TIPO_LOGRADOURO + " " + logradouro.NOME_LOGRADOURO + "\""; }).join().trim();
                if (confirm("Confirma a sele\u00E7\u00E3o dos logradouros:\n " + msg)) {
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
    };
    CamadaLogradouro.prototype.featureAdded = function (bhMapComponentInstance, ponto) {
        _super.prototype.featureAddedWFS.call(this, bhMapComponentInstance, ponto);
    };
    return CamadaLogradouro;
}(AbstractCamada));
var CamadaDefault = /** @class */ (function (_super) {
    __extends(CamadaDefault, _super);
    function CamadaDefault() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CamadaDefault.prototype.executaCallback = function (objetoArr, bhMapComponentInstance, ponto) {
        if (objetoArr.length > 0) {
            var objetosRetorno = objetoArr.map(function (obj) {
                return { objRetorno: obj, ponto: ponto };
            });
            bhMapComponentInstance.emitter.emit({ objetosRetorno: objetosRetorno });
        }
        else {
            alert('Ponto não encontrado');
        }
    };
    CamadaDefault.prototype.featureAdded = function (bhMapComponentInstance, ponto) {
        _super.prototype.featureAddedWFS.call(this, bhMapComponentInstance, ponto);
    };
    return CamadaDefault;
}(AbstractCamada));
var CamadaParque = /** @class */ (function (_super) {
    __extends(CamadaParque, _super);
    function CamadaParque() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CamadaParque.prototype.executaCallback = function (objetoArr, bhMapComponentInstance, ponto) {
        var bhMap = bhMapComponentInstance.bhMap;
        if (!objetoArr || objetoArr.length === 0) {
            alert('Parque não encontrado.');
            bhMap.removerPontos();
        }
        else {
            var parque = objetoArr[0].data;
            if (confirm("Confirma a sele\u00E7\u00E3o do parque: \"" + parque.NOME + "\" ?")) {
                bhMapComponentInstance.emitter.emit({ objetosRetorno: [{ parque: parque, ponto: ponto }] });
            }
            else {
                bhMap.removerPontos();
            }
        }
    };
    CamadaParque.prototype.featureAdded = function (bhMapComponentInstance, ponto) {
        _super.prototype.featureAddedWFS.call(this, bhMapComponentInstance, ponto);
    };
    return CamadaParque;
}(AbstractCamada));
var FactoryCamada = /** @class */ (function () {
    function FactoryCamada() {
    }
    FactoryCamada.prototype.recuperaCallbacksCamada = function (tiposCamadas) {
        this.tipoCamadaPrincipal = tiposCamadas.filter(function (tipoCamada) { return tipoCamada.camadaEnum; })[0];
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
    };
    return FactoryCamada;
}());
var GeocoderService = /** @class */ (function () {
    function GeocoderService(httpClient) {
        this.httpClient = httpClient;
    }
    GeocoderService.prototype.recuperaEnderecoPorGeometria = function (longitude, latitude, isProduction) {
        var pontoWKT = "POINT(" + longitude + "  " + latitude + ")";
        return this.httpClient.get(getUrlGeocoder(isProduction) + "geocoder/v2/coordinate?ponto=" + pontoWKT);
    };
    GeocoderService.prototype.recuperaEnderecosPorLogradouro = function (nomeLogradouro, numero, isProduction) {
        if (!nomeLogradouro) {
            alert('É obrigatório informar o nome do logradouro.');
            return;
        }
        var newEndereco = nomeLogradouro.toLowerCase().replace(filtroEndereco, '');
        nomeLogradouro = newEndereco.toUpperCase().trim();
        var params = "?logradouro=" + nomeLogradouro;
        if (numero) {
            params += "&numero=" + numero;
        }
        return this.httpClient.get(getUrlGeocoder(isProduction) + "geocoder/v2/address" + params);
    };
    GeocoderService.prototype.zoomEndereco = function (endereco, bhMap) {
        var latitudeLongitude = this.getPonto(endereco);
        bhMap.centerMap([latitudeLongitude[0], latitudeLongitude[1]]);
    };
    GeocoderService.prototype.getPonto = function (endereco) {
        var cordenadas = endereco.wkt;
        var busca = 'POINT(';
        var ini = cordenadas.indexOf(busca) + busca.length;
        var fim = cordenadas.indexOf(')', ini);
        var lonLat = cordenadas.substr(ini, fim - ini).split(' ');
        return lonLat;
    };
    return GeocoderService;
}());
GeocoderService.decorators = [
    { type: core.Injectable },
];
GeocoderService.ctorParameters = function () { return [
    { type: http.HttpClient, },
]; };
var BhMapComponent = /** @class */ (function () {
    function BhMapComponent(geocoderService, bhMapService) {
        this.geocoderService = geocoderService;
        this.bhMapService = bhMapService;
        this.tiposCamadas = [new TipoCamada({ camadaEnum: CamadasEnum.Logradouro, tipoControlePontoEnum: TipoControlePontoEnum.trajeto })];
        this.urlProxy = 'http://localhost:8080/licenciamento/proxy?server=';
        this.isProduction = false;
        this.emitter = new core.EventEmitter();
        this.tipoControlePontoEnum = TipoControlePontoEnum;
        this.spinkit = spinkits.Spinkit;
        this.factoryCamada = new FactoryCamada();
    }
    BhMapComponent.prototype.ngOnInit = function () {
        this.bhMap = new BhMap(this.urlProxy, this.isProduction);
        this.abstractCamada = this.factoryCamada.recuperaCallbacksCamada(this.tiposCamadas);
        this.carregarCamadas();
        this.adicionaControlePonto();
        this.adicionaPainelSelecaoCamadas();
    };
    BhMapComponent.prototype.carregarCamadas = function () {
        var _this = this;
        this.tiposCamadas.forEach(function (tipoCamada) {
            _this.bhMapService.buscaCamadaBhMap("" + _this.bhMap.proxyHost + _this.bhMap.host + caminhoMetadados + "/" + tipoCamada.camadaEnum).subscribe(function (layer) {
                _this.bhMap.addLayerWMS(layer, tipoCamada.visivel, tipoCamada.opacidade);
                if (tipoCamada.wfs) {
                    _this.bhMap.camadaPrincipal = layer;
                }
            });
        });
    };
    BhMapComponent.prototype.adicionaControlePonto = function () {
        this.bhMap.tipoControlePonto = this.factoryCamada.tipoCamadaPrincipal.tipoControlePontoEnum;
        this.draw = new Draw({
            source: this.bhMap.source,
            type: this.bhMap.tipoControlePonto
        });
        var bhMapComponentInstance = this;
        this.bhMap.source.on('addfeature', function (evt) {
            bhMapComponentInstance.abstractCamada.featureAdded(bhMapComponentInstance, evt);
        });
        this.bhMap.map.addInteraction(this.draw);
    };
    BhMapComponent.prototype.adicionaPainelSelecaoCamadas = function () {
        if (this.painelSelecaoCamadas) {
            this.tiposCamadasSelecaoUsuario = this.abstractCamada.recuperaListaCamadasParaSelecao(this.tiposCamadas);
        }
    };
    BhMapComponent.prototype.zoomIn = function () {
        var view = this.bhMap.map.getView();
        var zoom = view.getZoom();
        view.setZoom(zoom + 1);
        return false;
    };
    BhMapComponent.prototype.zoomOut = function () {
        var view = this.bhMap.map.getView();
        var zoom = view.getZoom();
        view.setZoom(zoom - 1);
        return false;
    };
    BhMapComponent.prototype.removerPontos = function () {
        this.bhMap.removerPontos();
        this.bhMap.map.removeInteraction(this.draw);
        this.bhMap.map.addInteraction(this.draw);
    };
    BhMapComponent.prototype.configuraVisibilidade = function (id, selecionado) {
        var layer = this.bhMap.recuperaCamadaPeloId(id);
        layer.setVisible(selecionado);
    };
    BhMapComponent.prototype.changeCamada = function (camadasSelecionadas) {
        var _this = this;
        if (camadasSelecionadas.length && !this.abstractCamada.configuraVisibilidadeEspecifico(camadasSelecionadas, this.bhMap)) {
            camadasSelecionadas.filter(function (c) { return c.habilitado; }).forEach(function (c) { return _this.configuraVisibilidade(c.camadaEnum, c.selecionado); });
        }
    };
    BhMapComponent.prototype.keypressLogradouro = function (event) {
        if (event.keyCode === 13) {
            return this.buscaLogradouro();
        }
        return true;
    };
    BhMapComponent.prototype.buscaLogradouro = function () {
        var _this = this;
        this.enderecos = null;
        this.geocoderService.recuperaEnderecosPorLogradouro(this.nomeLogradouro, this.numeroLogradouro, this.isProduction).subscribe(function (resposta) {
            if (resposta.status !== 'ok') {
                alert('Ocorreu um erro na resposta da pesquisa de endereço, tente novamente mais tarde.');
            }
            else if (resposta.endereco.length === 0) {
                if (_this.msgErroEndereco) {
                    alert(_this.msgErroEndereco);
                }
                else {
                    alert('Endereço não encontrado.');
                }
            }
            else if (resposta.endereco.length === 1) {
                var endereco = resposta.endereco[0];
                if (!endereco.id) {
                    if (_this.msgErroEndereco) {
                        alert(_this.msgErroEndereco);
                    }
                    else {
                        alert('Endereço não encontrado.');
                    }
                    return false;
                }
                _this.zoomEndereco(endereco);
            }
            else {
                _this.enderecos = resposta.endereco;
            }
        }, (function (resposta) {
            alert('Ocorreu um erro ao buscar o logradouro. Tente novamente mais tarde.');
            console.error(resposta.error.detalhes);
        }));
        return false;
    };
    BhMapComponent.prototype.limparEnderecos = function () {
        this.enderecos = null;
        return false;
    };
    BhMapComponent.prototype.zoomEndereco = function (endereco) {
        this.enderecos = null;
        this.geocoderService.zoomEndereco(endereco, this.bhMap);
    };
    BhMapComponent.prototype.ngOnDestroy = function () {
    };
    return BhMapComponent;
}());
BhMapComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'app-bhmap',
                styles: [".cabecalho{text-align:center;color:#000;font-weight:700;background-color:#d3d3d3;opacity:.8}.btn{border:1px solid transparent;padding:.375rem .75rem;line-height:1.5;cursor:pointer;opacity:.7}.btn-success{color:#fff;background-color:#28a745;border-color:#28a745}.btn-danger{color:#fff;background-color:#c82333;border-color:#bd2130}.btn-lograd{cursor:pointer;border:none;opacity:.7}.btn-lupa{background:url(data:image/gif;base64,R0lGODlhFAAUAPcAAP////7+/vz///39/fb///n///L///z8/Pv7++////r6+vn5+fj4+OL//+H//+D///f3993//9r//9v//9X//9n//9f//9j//9X+//X19dL//9D///T09PPz887+/9H7/8j8//Hx8fDw8O/v78r4/8j4/+7u7s73/+3t7cv2/+zs7NLy/+vr6+rq6unp6cTz/8Xv/+fn5+bm5sHu/+Xl5ePj4+Pi4uLi4sDp/+Hh4eDg4N/f38Lk+97e3t3d3dzc3Lri/Nvb28rg6cje49nZ2NnY19nY2NjY2MHf4djY19fX2NfX19PY4Lbc+6zf/7jd6tbW1q3e/9XV1bDc/9LU1dPT09LS06fb/9HR0dHS08/Pz87Ozs3Nzc7Oze7NZs3NzMvLzPDLZZTV//bHY8nJyMjIyMfHx8TExMXFxMPDxMPDw8HDx8LCwr/CwqbF4r+/v7q9xbe7wrq5uaC7yae6x9i1V7S1tf2pSrSzsbmxr6O3uqa1xP+lR6+yt7Cxsa2wsrCvra+vr6uvsfehRauqqq2qnZSszqmmnKeil5ygw5+dnIufrZeXl8qMYZeVlZWSnbaLfo2UnJSSkcuGXJGRkpWRj4STr4WRtJCQkJGRjZOQjJOOipGOi5CMko2Mi4uLi4mIioqHhXyJkYaFh6p9dIaEgqV5dn2DhYGAfqJ4dH9+f3J/lHh+hnt7fnp4eHd3e3d2dml5gWp5gnd1e3h0cGV3fnRzd21yh3BvbnBubWlueGdnZ2Rma2FmdFphZldeYV1bXlpZV1pYWFpWVlRUUVNSUFRST1NPS01MSkxJSUpIS0lJSExHRTg3NgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAQUAP8ALAAAAAAUABQAAAj/AAEIHEiwoEGDDFTokKKl4ZEaIxQcFGjixxY/pTZtkrPlRggEB0dYzOUqEp09rzx9uSHCIIIaWFDxYvLAA4gnt0KRqQGhoIgggFoJAbDiSpQTPHrhkcKioAorkkRVwDFlxokTGAzZ6kKjIIsujxKVEANDggYNEtwAO7PDK5lOlig4+XAhQQIHeoSd6UEQAQ01mVY1eUEigoDDp4Kl8THwwIgifTjRugTEgoUGBNoo27WlKwDHROIgqjNpFqs5SIYsajbqTRIUABCMIALnUJg7kH4dYzYsWTFYgaCw4AAgg401hbzwSSVrmSpQoDAR2rLExQKKVPKMGWQqFjJKdtiUTtGy5AYKCAECADCRpVIjUrWMMUJTRYeMFi0WqB9owoggXb4Q44gZR4wA0kQcyKDFH7goAkaBB0w0UAcxJGFhDiNEKKFAB2QgwociSLRhQAA7);height:21px;width:21px;padding:6px}.btn-fechar{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAG1BMVEUAAADbVWHfUF/gT1/fT13fT1/gT1/gT18AAADzuIw9AAAAB3RSTlMAFbrWN9LwcKApFAAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfgCxkRDyO4SjzcAAAAU0lEQVQI12NgVHZgYGAxEmAQLU9hYHArD2RQLy9zYEkvL2IwLy9PcSsvLwaKlpelAzkMQGEgKHMAKSwHCTCAhUACCAZMCq4Yrh1uINwKuKUwZwAA6eEm66TvjNYAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTYtMTEtMjVUMTc6MTU6MzUrMDE6MDC3uE8LAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE2LTExLTI1VDE3OjE1OjM1KzAxOjAwxuX3twAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII=);height:16px;width:15px}.div-salvar{position:absolute;margin-right:55px;margin-bottom:200px;bottom:0;right:0;z-index:20000}.div-remover-pontos{position:absolute;margin-right:55px;margin-bottom:150px;bottom:0;right:0;z-index:20000}.div-camadas{position:absolute;overflow-y:auto;top:180px;border:1px solid #000;background-color:#d3d3d3;opacity:.8}.div-remove-pontos{position:absolute;top:150px}.div-pesquisa-logradouro{position:absolute;left:90px;top:10px;z-index:20000}.div-endereco{position:absolute;left:90px;top:66px;opacity:.9;z-index:20000;height:200px;overflow:auto}.tabela-pesquisa-logradouro{border:1px solid gray}.tabela-endereco{background-color:#d3d3d3;z-index:999;border:1px solid #000;cursor:pointer}.tabela-endereco>tbody>tr:nth-of-type(even){background-color:#f9f9f9}::-webkit-scrollbar{width:12px}::-webkit-scrollbar-track{-webkit-box-shadow:inset 0 0 6px rgba(0,0,0,.3);border-radius:10px}::-webkit-scrollbar-thumb{border-radius:10px;-webkit-box-shadow:inset 0 0 6px rgba(0,0,0,.5)}.logoBHMap{position:absolute;bottom:10px;right:10px;z-index:20000;background-image:url(data:image/png;base64,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);background-repeat:no-repeat;background-position:center center;background-size:contain;width:64px;height:18px}.BHMapZoomBox{z-index:20000;position:absolute;left:0;top:20px}.BHMapZoomBoxMinus a:hover,.BHMapZoomBoxPlus a:hover{-webkit-box-shadow:0 2px 8px rgba(0,0,0,.3),0 -1px 0 rgba(0,0,0,.03);box-shadow:0 2px 8px rgba(0,0,0,.3),0 -1px 0 rgba(0,0,0,.03)}.BHMapZoomBoxPlus a{position:absolute;left:10px;top:7px;width:25px;height:25px;margin:0;padding:0;background-color:#fafafa;border-radius:1px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAMAAADXT/YiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkUwRTZCRkI3NjQzNzExRTBBQUI3RTAwMUU2MTZDRkQ5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkUwRTZCRkI4NjQzNzExRTBBQUI3RTAwMUU2MTZDRkQ5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTBFNkJGQjU2NDM3MTFFMEFBQjdFMDAxRTYxNkNGRDkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTBFNkJGQjY2NDM3MTFFMEFBQjdFMDAxRTYxNkNGRDkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7cwPMXAAAABlBMVEUAAAD///+l2Z/dAAAAAnRSTlP/AOW3MEoAAAAZSURBVHjaYmBkZGRgYACR2Fj4AV69AAEGAAauACW68QgkAAAAAElFTkSuQmCC);background-repeat:no-repeat;background-position:center center;outline:0;border:none;-webkit-box-shadow:0 2px 4px rgba(0,0,0,.2),0 -1px 0 rgba(0,0,0,.02);box-shadow:0 2px 4px rgba(0,0,0,.2),0 -1px 0 rgba(0,0,0,.02)}.BHMapZoomBoxMinus a{position:absolute;left:10px;top:34px;width:25px;height:25px;margin:0;padding:0;background-color:#fafafa;border-radius:1px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAMAAADXT/YiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkU5MjRDMEQ5NjQzNzExRTBCM0JDQkU2MzVGQTBCNjRDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkU5MjRDMERBNjQzNzExRTBCM0JDQkU2MzVGQTBCNjRDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTkyNEMwRDc2NDM3MTFFMEIzQkNCRTYzNUZBMEI2NEMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTkyNEMwRDg2NDM3MTFFMEIzQkNCRTYzNUZBMEI2NEMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7uh53jAAAABlBMVEUAAAD///+l2Z/dAAAAAnRSTlP/AOW3MEoAAAAVSURBVHjaYmCEAQZsLPwAr16AAAMACdgAN9MxY1IAAAAASUVORK5CYII=);background-repeat:no-repeat;background-position:center center;outline:0;border:none;-webkit-box-shadow:0 2px 4px rgba(0,0,0,.2),0 -1px 0 rgba(0,0,0,.02);box-shadow:0 2px 4px rgba(0,0,0,.2),0 -1px 0 rgba(0,0,0,.02)}"],
                template: "\n<spinner [backgroundColor]=\"'#64676b'\" [spinner]=\"spinkit.skThreeBounce\" [debounceDelay]=\"200\">\n</spinner>\n\n<!-- Controles de zoom do mapa-->\n<div class=\"BHMapZoomBox\">\n  <div class=\"BHMapZoomBoxPlus\">\n     <a href=\"#\" (click)=\"zoomIn()\"></a>\n   </div>\n   <div class=\"BHMapZoomBoxMinus\">\n      <a href=\"#\" (click)=\"zoomOut()\"></a>\n  </div>\n</div>\n\n<!-- Div que renderiza o mapa\n\n  \n<div id=\"BHMap\" style=\"height: 98vH; width: 99vW; -webkit-box-flex: 0; -ms-flex: 0 0 100%; flex: 0 0 100%;max-width: 100%;\"></div> -->\n \n\n<div id=\"map\" class=\"map\" style=\"height: 98vH; width: 99vW; -webkit-box-flex: 0; -ms-flex: 0 0 100%; flex: 0 0 100%;max-width: 100%;\"></div>\n\n\n<!--Pesquisa por logradouros.-->\n\n<div class=\"div-pesquisa-logradouro\">\n <table class=\"tabela-pesquisa-logradouro\">\n   <tr>\n     <td class=\"cabecalho\"><label for=\"nomeLogradouro\">Logradouro</label>\n     </td>\n   </tr>\n   <tr>\n     <td>\n       <input type=\"text\" [(ngModel)]=\"nomeLogradouro\" style=\"width: 180px;\" placeholder=\"Digite o endere\u00E7o\" (keypress)=\"keypressLogradouro($event)\"  />\n       <input type=\"number\" [(ngModel)]=\"numeroLogradouro\" style=\"width: 50px;\" min=\"1\" placeholder=\"N\u00BA\" (keypress)=\"keypressLogradouro($event)\"  />\n       <button (click)=\"buscaLogradouro()\" type=\"button\" class=\"btn-lograd btn-lupa\" title=\"Pesquisar\"></button>\n     </td>\n   </tr>\n </table>\n</div>\n\n<!-- Grid de resultado pesquisa logradouros -->\n\n<div class=\"div-endereco\">\n <table class=\"tabela-endereco\" *ngIf=\"enderecos && enderecos.length > 1\">\n   <tr>\n     <td style=\"text-align:right\">\n       <button (click)=\"limparEnderecos()\" class=\"btn-lograd btn-fechar\" type=\"button\" title=\"Fechar\"></button>\t\n     </td>\n   </tr>\n   <tr *ngFor=\"let endereco of enderecos\" (click)=zoomEndereco(endereco)>\n     <td> {{endereco.tipologradouro}} {{endereco.nomelogradouro}} , BAIRRO {{endereco.bairropopular | uppercase}}\n     </td>\n   </tr>\n </table>\n</div>\n\n<!--Componente de camadas / profundidades.-->\n\n<ng-container *ngIf=\"tiposCamadasSelecaoUsuario\">\n  <app-painel-selecao-camadas id=\"camadas\" [(ngModel)]=\"tiposCamadasSelecaoUsuario\" (change)=\"changeCamada($event)\" ></app-painel-selecao-camadas>\n</ng-container>\n\n<div class=\"div-remover-pontos\">\n <button type=\"button\" class=\"btn btn-danger\" (click)=\"removerPontos()\">Remover pontos</button>\n</div>\n\n\n\n<div class=\"logoBHMap\"> </div>"
            },] },
];
BhMapComponent.ctorParameters = function () { return [
    { type: GeocoderService, },
    { type: BhMapService, },
]; };
BhMapComponent.propDecorators = {
    "tiposCamadas": [{ type: core.Input },],
    "urlProxy": [{ type: core.Input },],
    "isProduction": [{ type: core.Input },],
    "emitter": [{ type: core.Output },],
    "painelSelecaoCamadas": [{ type: core.Input },],
    "msgErroEndereco": [{ type: core.Input },],
    "zoomMaximo": [{ type: core.Input },],
};
var WorspaceCamadaEnum = {
    BhGeo: 'ide_bhgeo',
    Sirgas: 'pbh_sirgas',
    PbhBase: 'pbh_base',
};
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
var BhMapImageService = /** @class */ (function () {
    function BhMapImageService(httpClient, bhMapService) {
        this.httpClient = httpClient;
        this.bhMapService = bhMapService;
    }
    BhMapImageService.prototype.registraVariaveis = function (urlProxy, isProduction, camadasEnum) {
        this.proxyHost = urlProxy;
        this.urlBhMap = getUrlBhMap(isProduction);
        this.workspaceBase = "" + getWorkspaceByCamada(camadasEnum[0]);
        this.urlCamadas = getUrlCamadas(isProduction);
        if (this.workspaceBase === WorspaceCamadaEnum.Sirgas) {
            this.nomeMapaBase = 'S2000_BHBASE';
            this.sirgas = true;
        }
        else {
            this.nomeMapaBase = 'MAPA_BASE';
            this.sirgas = false;
        }
    };
    BhMapImageService.prototype.getGeometriasEImagem = function (urlProxy, isProduction, camadasEnum, cqlFilter, largura, altura, buffer) {
        var _this = this;
        if (largura === void 0) { largura = 800; }
        if (altura === void 0) { altura = 600; }
        if (buffer === void 0) { buffer = 100; }
        this.registraVariaveis(urlProxy, isProduction, camadasEnum);
        return new Observable.Observable(function (observer) {
            if (!cqlFilter) {
                observer.next();
                observer.complete();
                return;
            }
            var cqlFilterGeometria = _this.aplicaFiltroEspecificoParaGeometria(cqlFilter, camadasEnum);
            var typename = _this.workspaceBase + ":" + (_this.sirgas ? 'S2000_' : '') + camadasEnum[0].toUpperCase();
            _this.bhMapService.getFeature(typename, cqlFilterGeometria, _this.proxyHost, _this.urlBhMap).pipe(operators.mergeMap(function (json) {
                var features = new GeoJSON().readFeatures(json);
                var geometrias = features.map(function (ponto) {
                    return { geometry: ponto.geometry };
                });
                return _this.getImagem(urlProxy, isProduction, camadasEnum, geometrias, cqlFilter, largura, altura, buffer);
            })).subscribe(function (arrayBuffer) {
                observer.next(arrayBuffer);
                observer.complete();
            }, function (error) {
                console.error(error);
                observer.next();
                observer.complete();
            });
        });
    };
    BhMapImageService.prototype.getImagem = function (urlProxy, isProduction, camadasEnum, geometrias, cqlFilter, largura, altura, buffer) {
        var _this = this;
        if (largura === void 0) { largura = 800; }
        if (altura === void 0) { altura = 600; }
        if (buffer === void 0) { buffer = 100; }
        if (!this.workspaceBase) {
            this.registraVariaveis(urlProxy, isProduction, camadasEnum);
        }
        var parametros = {
            service: 'WMS',
            version: '1.1.0',
            request: 'GetMap',
            srs: epsg,
            format: 'image/png',
            layers: this.workspaceBase + ":" + this.nomeMapaBase + "," + camadasEnum.map(function (camadaEnum) { return getWorkspaceByCamada(camadaEnum) + ":" + (_this.sirgas ? 'S2000_' : '') + camadaEnum.toUpperCase(); }).join(','),
            bbox: "" + calculaAreaImagemPorGeometrias(geometrias, buffer),
            width: largura,
            height: altura,
            cql_filter: "include;" + cqlFilter
        };
        return new Observable.Observable(function (observer) { return _this.httpClient.get("" + _this.proxyHost + _this.urlCamadas + _this.workspaceBase + "/wms?" + concatInQueryParams(parametros), { responseType: 'arraybuffer' }).subscribe(function (blob) {
            observer.next(blob);
            observer.complete();
        }, function (error) {
            console.error(error);
            observer.error(error);
        }); });
    };
    BhMapImageService.prototype.aplicaFiltroEspecificoParaGeometria = function (cqlFilter, camadasEnum) {
        if (camadasEnum.find(function (c) { return c === CamadasEnum.ObraLogradouro; })) {
            return cqlFilter.split(';')[0];
        }
        return cqlFilter;
    };
    return BhMapImageService;
}());
BhMapImageService.decorators = [
    { type: core.Injectable },
];
BhMapImageService.ctorParameters = function () { return [
    { type: http.HttpClient, },
    { type: BhMapService, },
]; };
var PainelSelecaoCamadasComponent = /** @class */ (function () {
    function PainelSelecaoCamadasComponent() {
        this.change = new core.EventEmitter();
        this.camadas = new Array();
        this.propagateChange = function (_) { };
    }
    Object.defineProperty(PainelSelecaoCamadasComponent.prototype, "model", {
        get: function () {
            return this.camadas;
        },
        set: function (value) {
            this.camadas = value;
        },
        enumerable: true,
        configurable: true
    });
    PainelSelecaoCamadasComponent.prototype.writeValue = function (value) {
        if (value !== undefined) {
            this.camadas = value;
        }
    };
    PainelSelecaoCamadasComponent.prototype.registerOnChange = function (fn) {
        this.propagateChange = fn;
    };
    PainelSelecaoCamadasComponent.prototype.registerOnTouched = function () { };
    PainelSelecaoCamadasComponent.prototype.onChange = function (camadaCorrente) {
        var camadasResultantes = this.camadas.filter(function (c) { return c.selecionado && c.id !== camadaCorrente.id; });
        camadasResultantes.push(camadaCorrente);
        this.change.emit(camadasResultantes);
    };
    return PainelSelecaoCamadasComponent;
}());
PainelSelecaoCamadasComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'app-painel-selecao-camadas',
                styles: [".div-camadas{position:absolute;overflow-y:auto;top:180px;border:1px solid #000;background-color:#d3d3d3;opacity:.8;z-index:20000}"],
                template: "<div class=\"div-camadas\">\n\n    <div style=\"text-align: center;padding-top: 5px;\"><b>Visualizar</b></div>\n\n\n    <div style=\"margin:5px;\">\n\n        <div *ngFor=\"let c of camadas\">\n            <input type=\"checkbox\" [id]=\"c.nome\" [(ngModel)]=\"c.selecionado\" #ckb=\"ngModel\" [disabled]=\"!c.habilitado\"\n                (change)=\"onChange(c)\" />\n            <label [for]=\"c.nome\">{{ c.descricao }}</label>\n        </div>\n\n    </div>\n</div>",
                providers: [{
                        provide: forms.NG_VALUE_ACCESSOR,
                        useExisting: core.forwardRef(function () { return PainelSelecaoCamadasComponent; }),
                        multi: true
                    }]
            },] },
];
PainelSelecaoCamadasComponent.propDecorators = {
    "change": [{ type: core.Output },],
    "model": [{ type: core.Input },],
};
var BhMapModule = /** @class */ (function () {
    function BhMapModule() {
    }
    return BhMapModule;
}());
BhMapModule.decorators = [
    { type: core.NgModule, args: [{
                declarations: [
                    BhMapComponent,
                    PainelSelecaoCamadasComponent
                ],
                imports: [
                    common.CommonModule,
                    forms.FormsModule,
                    ngHttpLoader_module.NgHttpLoaderModule
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

exports.ObjetoOutputMapa = ObjetoOutputMapa;
exports.CamadasEnum = CamadasEnum;
exports.TipoControlePontoEnum = TipoControlePontoEnum;
exports.TipoCamada = TipoCamada;
exports.BhMapComponent = BhMapComponent;
exports.BhMapImageService = BhMapImageService;
exports.BhMapModule = BhMapModule;
exports.ɵc = PainelSelecaoCamadasComponent;
exports.ɵb = BhMapService;
exports.ɵa = GeocoderService;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bhmap.umd.js.map

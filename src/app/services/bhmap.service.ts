import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { epsg, concatInQueryParams } from '../helpers/utils';
import { BhMap } from '../models/bhMap';

@Injectable()
export class BhMapService {

    constructor(protected httpClient: HttpClient) { }

    buscaCamadaBhMap(caminho: string): Observable<any> {
        return this.httpClient.get(caminho);
    }

    /**
     * Busca no servidor do BhMaps um json com informações da camada.
     * Este método também transforma a coordenada original em pixel para adicionar limites (superior / inferior) baseados em um raio e converte novamente
     * o pixel para as coordenadas inferior e superior, possibilitando uma pesquisa mais precisa.
     * @param coordenadas
     * @param bhMap
     */
    getFeatureDataWFS(coordenadas: [number, number], bhMap: BhMap): Observable<any> {

        const camadaPrincipal = bhMap.camadaPrincipal;

        // Para adicionar o raio de pesquisa é necessário obter o pixel pela coordenada: Longitude / Latitude.
        const pixel = bhMap.map.getPixelFromCoordinate(coordenadas);
        const objetoPontoGeometria = { x: pixel[0], y: pixel[1] };

        let raioBusca = 1;

        // Utiliza o raio padrão da camada se informado.
        if (camadaPrincipal.servicos.wfs.raiobusca) {
            raioBusca = camadaPrincipal.servicos.wfs.raiobusca;
        }

        // Faz um clone do pixel original e adiciona / diminui o raio.
        const lowerPixel = Object.assign({}, objetoPontoGeometria);

        lowerPixel.x -= raioBusca;
        lowerPixel.y += raioBusca;

         // Obtém a coordenada inferior para ser utilizada como filtro na chamada do backend
        const lowerCoordinates = bhMap.map.getCoordinateFromPixel([lowerPixel.x, lowerPixel.y]);

        // Faz um clone do pixel original e adiciona / diminui o raio.
        const upperPixel = Object.assign({}, objetoPontoGeometria);

        upperPixel.x += raioBusca;
        upperPixel.y -= raioBusca;

         // Obtém a coordenada superior para ser utilizada como filtro na chamada do backend
        const upperCoordinates = bhMap.map.getCoordinateFromPixel([upperPixel.x, upperPixel.y]);

        // Faz a chamada no backend utilizando os filtros.
        return this.httpClient.get(`${bhMap.proxyHost}${camadaPrincipal.servicos.wfs.url}?${this.getQueryParams(camadaPrincipal, lowerCoordinates, upperCoordinates)}`);
    }

    /**
     * Transforma um objeto de filtro em uma string.
     * @param camadaPrincipal
     * @param lowerCoordinates
     * @param upperCoordinates
     */

    private getQueryParams(camadaPrincipal: any, lowerCoordinates: Array<number>, upperCoordinates: Array<number>): string {
        const queryFilterObject = {
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
     * @param typeName
     * @param cqlFilterGeometria
     */

    getFeature(typeName: string, cqlFilterGeometria: string, proxyHost: string, urlBhMap: string): Observable<any> {

        const parametros = {
            version: '2.0',
            request: 'GetFeature',
            typeName: typeName,
            outputFormat: 'application/json',
            CQL_FILTER: `${cqlFilterGeometria}`

        };

        return this.httpClient.get(`${proxyHost}${urlBhMap}v2/api/wfs?${concatInQueryParams(parametros)}`);
    }

}

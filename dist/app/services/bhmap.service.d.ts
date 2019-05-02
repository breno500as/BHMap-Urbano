import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BhMap } from '../models/bhMap';
export declare class BhMapService {
    protected httpClient: HttpClient;
    constructor(httpClient: HttpClient);
    buscaCamadaBhMap(caminho: string): Observable<any>;
    /**
     * Busca no servidor do BhMaps um json com informações da camada.
     * Este método também transforma a coordenada original em pixel para adicionar limites (superior / inferior) baseados em um raio e converte novamente
     * o pixel para as coordenadas inferior e superior, possibilitando uma pesquisa mais precisa.
     * @param coordenadas
     * @param bhMap
     */
    getFeatureDataWFS(coordenadas: [number, number], bhMap: BhMap): Observable<any>;
    /**
     * Transforma um objeto de filtro em uma string.
     * @param camadaPrincipal
     * @param lowerCoordinates
     * @param upperCoordinates
     */
    private getQueryParams;
    /**
    * Recupera um json com a geometria
    * @param typeName
    * @param cqlFilterGeometria
    */
    getFeature(typeName: string, cqlFilterGeometria: string, proxyHost: string, urlBhMap: string): Observable<any>;
}

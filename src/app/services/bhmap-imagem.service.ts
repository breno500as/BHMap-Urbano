
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operators';
import { CamadasEnum } from '../enums/camadasEnum';
import GeoJSON from 'ol/format/GeoJSON';
import { getWorkspaceByCamada, WorspaceCamadaEnum } from '../enums/worspaceCamadaEnum';
import { calculaAreaImagemPorGeometrias, concatInQueryParams, epsg, getUrlBhMap, getUrlCamadas } from '../helpers/utils';
import { BhMapService } from './bhmap.service';

/**
 *  Service que retorna uma imagem do servidor de backend do bhmaps (goserver) de acordo com  um filtro (cql_filter) e uma camada.
 *  @author breno.mcosta
 */

@Injectable()
export class BhMapImageService {

    private proxyHost: string;
    private urlBhMap: string;
    private workspaceBase: string;
    private urlCamadas: string;
    private nomeMapaBase: string;
    private sirgas: boolean;

    constructor(private httpClient: HttpClient, private bhMapService: BhMapService) { }

    /**
     *  Registra varíaveis e urls.
     * @param urlProxy
     * @param isProduction
     * @param camadasEnum
     */

    private registraVariaveis(urlProxy: string, isProduction: boolean, camadasEnum: Array<CamadasEnum>): void {
        this.proxyHost = urlProxy;
        this.urlBhMap = getUrlBhMap(isProduction);
        this.workspaceBase = `${getWorkspaceByCamada(camadasEnum[0])}`;
        this.urlCamadas = getUrlCamadas(isProduction);
        if (this.workspaceBase === WorspaceCamadaEnum.Sirgas) {
            this.nomeMapaBase = 'S2000_BHBASE';
            this.sirgas = true;
        } else {
            this.nomeMapaBase = 'MAPA_BASE';
            this.sirgas = false;
        }
    }

    /**
     *  Recupera as geometrias e a imagem de acordo com os parâmetros informados.
     * @param urlProxy - URL do servidor proxy no backend responsável por buscar recursos via https..
     * @param isProduction - Variável que define se as urls do bhmaps seram de homologação ou produção.
     * @param camadasEnum  - Array de camadas que serão adicionadas com a camada base para geração da imagem, a primeira camada deve ser a mesma do cqlFilter. Ver CamadasEnum.ts.
     * @param cqlFilter  - Filtro para recuperação das geometrias da camada, mais detalhes em https://wiki.state.ma.us/display/massgis/GeoServer+-+CQL
     * @param largura - Largura da imagem, argumento com valor default 800px.
     * @param altura - Largura da imagem, argumento com valor default 600px.
     * @param buffer - Buffer para cálculo da área da imagem, após a concatenação das geometrias esse valor é aplicado para dar um zoom melhor na imagem. Quanto maior o valor do buffer menor será o zoom da imagem, argumento com valor default 100
     */

    getGeometriasEImagem(urlProxy: string, isProduction: boolean, camadasEnum: Array<CamadasEnum>, cqlFilter: string, largura: number = 800, altura: number = 600, buffer: number = 100): Observable<any> {


        this.registraVariaveis(urlProxy, isProduction, camadasEnum);

        return new Observable((observer) => {

            if (!cqlFilter)  {
                observer.next();
                observer.complete();
                return;
            }

            const cqlFilterGeometria = this.aplicaFiltroEspecificoParaGeometria(cqlFilter, camadasEnum);

            const typename = `${this.workspaceBase}:${this.sirgas ? 'S2000_' : ''}${camadasEnum[0].toUpperCase()}`;

            this.bhMapService.getFeature(typename, cqlFilterGeometria, this.proxyHost, this.urlBhMap).pipe(mergeMap(json => {

 

               const features = new GeoJSON().readFeatures(json);

                const geometrias = features.map((ponto: any) => {
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
     * @param urlProxy - URL do servidor proxy no backend responsável por buscar recursos via https..
     * @param isProduction - Variável que define se as urls do bhmaps seram de homologação ou produção.
     * @param camadasEnum  - Array de camadas que serão adicionadas com a camada base para geração da imagem, a primeira camada deve ser a mesma do cqlFilter. Ver CamadasEnum.ts.
     * @param geometrias - geometrias dos pontos caso já existam.
     * @param cqlFilter  - Filtro para recuperação das geometrias da camada, mais detalhes em https://wiki.state.ma.us/display/massgis/GeoServer+-+CQL
     * @param largura - Largura da imagem, argumento com valor default 800px.
     * @param altura - Largura da imagem, argumento com valor default 600px.
     * @param buffer - Buffer para cálculo da área da imagem, após a concatenação das geometrias esse valor é aplicado para dar um zoom melhor na imagem. Quanto maior o valor do buffer menor será o zoom da imagem, argumento com valor default 100
     */

    getImagem(urlProxy: string, isProduction: boolean, camadasEnum: Array<CamadasEnum>, geometrias: any, cqlFilter: string, largura: number = 800, altura: number = 600, buffer: number = 100): Observable<any> {

        if (!this.workspaceBase) {
            this.registraVariaveis(urlProxy, isProduction, camadasEnum);
        }

        const parametros = {
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

        return new Observable((observer) =>
            this.httpClient.get(`${this.proxyHost}${this.urlCamadas}${this.workspaceBase}/wms?${concatInQueryParams(parametros)}`, { responseType: 'arraybuffer' }).subscribe(blob => {
                observer.next(blob);
                observer.complete();
            }, (error) => {
                console.error(error);
                observer.error(error);
        }));

    }

    /**
     *  Aplica um filtro específico caso o filtro da recuperação da geometria seja diferente da imagem.
     * @param cqlFilter
     * @param camadasEnum
     */

    private aplicaFiltroEspecificoParaGeometria(cqlFilter: string, camadasEnum: Array<CamadasEnum>) {

        // No caso da camada de obra o filtro pelo COD_PROFUNDIDADE é feito apenas na query de imagem e não na de geometria.
        if (camadasEnum.find(c => c === CamadasEnum.ObraLogradouro)) {
            return cqlFilter.split(';')[0];
        }

        return cqlFilter;
    }

}

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CamadasEnum } from '../enums/camadasEnum';
import { BhMapService } from './bhmap.service';
/**
 *  Service que retorna uma imagem do servidor de backend do bhmaps (goserver) de acordo com  um filtro (cql_filter) e uma camada.
 *  @author breno.mcosta
 */
export declare class BhMapImageService {
    private httpClient;
    private bhMapService;
    private proxyHost;
    private urlBhMap;
    private workspaceBase;
    private urlCamadas;
    private nomeMapaBase;
    private sirgas;
    constructor(httpClient: HttpClient, bhMapService: BhMapService);
    /**
     *  Registra varíaveis e urls.
     * @param urlProxy
     * @param isProduction
     * @param camadasEnum
     */
    private registraVariaveis;
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
    getGeometriasEImagem(urlProxy: string, isProduction: boolean, camadasEnum: Array<CamadasEnum>, cqlFilter: string, largura?: number, altura?: number, buffer?: number): Observable<any>;
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
    getImagem(urlProxy: string, isProduction: boolean, camadasEnum: Array<CamadasEnum>, geometrias: any, cqlFilter: string, largura?: number, altura?: number, buffer?: number): Observable<any>;
    /**
     *  Aplica um filtro específico caso o filtro da recuperação da geometria seja diferente da imagem.
     * @param cqlFilter
     * @param camadasEnum
     */
    private aplicaFiltroEspecificoParaGeometria;
}

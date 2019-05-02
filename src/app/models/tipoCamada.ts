import { CamadasEnum } from '../enums/camadasEnum';
import { TipoControlePontoEnum } from '../enums/tipoControlePontoEnum';

/**
 *  Objeto de configuração de camadas.
 */

export class TipoCamada {

    // Enum que contém o caminho / id de recuperação da camada no servidor de backend do bhmaps.
    camadaEnum: CamadasEnum;

    // Um booleano que define se é a camada irá buscar informações no geoserver (feature wfs). O valor default é true.
    wfs?: boolean;

    // O tipo de controle da camada, disponível em TipoControlePontoEnum.ts (ponto, poligono, trajeto, box). O valor default é ponto.
    tipoControlePontoEnum?: TipoControlePontoEnum;

    // Se a camada é vísivel ou não. O valor default é true
    visivel?: boolean;

    // Opacidade da camada. O valor default é 0.5
    opacidade?: number;

    // Propriedades que devem ser preenchidas quando o mapa tiver o painel de seleção de camadas, um painel que exibe um checkbox de camadas.
    // A descrição da camada que irá aparecer no checkbox.
    descricao?: string;

    // O valor do checkbox selecionado true ou false. O valor default é false.
    selecionado?: boolean;

    // Se o checkbox da camada irá ficar habilitado, existem camadas que não devem ter sua visibilidade alterada pelo usuário.  O valor default é true.
    habilitado?: boolean;

    // Id para diferenciação das camadas no momente de alterar a visibilidade.
    id?: number;

    /**
     * Construtor com valores default.
     * @param params
     */
    constructor(params: TipoCamada = {} as TipoCamada) {
        this.camadaEnum = params.camadaEnum;
        this.wfs = params.wfs === undefined ? true : params.wfs;
        this.tipoControlePontoEnum = params.tipoControlePontoEnum ? params.tipoControlePontoEnum : TipoControlePontoEnum.ponto;
        this.visivel = params.visivel === undefined ? true : params.visivel;
        this.opacidade =  params.opacidade === undefined ? 0.5 : params.opacidade;
        this.descricao = params.descricao;
        this.selecionado = params.selecionado === undefined ? false : params.selecionado;
        this.habilitado = params.habilitado === undefined ? true : params.habilitado;
        this.id = params.id;
    }
}

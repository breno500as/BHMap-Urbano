import { TipoCamada } from '../../models/tipoCamada';
import { AbstractCamada } from './abstract-camada';
import { CamadasEnum } from '../../enums/camadasEnum';
import { CamadaAreaTrechoLogradouro } from '../../helpers/camadas/camada-area-trecho-logradouro';
import { CamadaEndereco } from '../../helpers/camadas/camada-endereco';
import { CamadaLogradouro } from '../../helpers/camadas/camada-logradouro';
import { CamadaDefault } from '../../helpers/camadas/camada-default';
import { CamadaParque } from '../../helpers/camadas/camada-parque';



export class FactoryCamada {


    tipoCamadaPrincipal: TipoCamada;


    /**
    *  Método que recupera a classe de callback da camada de acordo com a propriedade camadaPrincipal informada na
    *  classe TipoCamada.ts. A classe de callback é utilizada para chamadas no servidor backend do bhmaps  Ver: AbstractCamada.ts método:  getFeatureDataWFS()
    *  e adição de comportamentos específicos após a adição de features no mapa.
    * @param tiposCamadas
    */
    recuperaCallbacksCamada(tiposCamadas: Array<TipoCamada>): AbstractCamada {

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

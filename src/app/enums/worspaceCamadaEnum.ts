import { CamadasEnum } from './camadasEnum';

export enum WorspaceCamadaEnum {

    BhGeo = 'ide_bhgeo',
    Sirgas = 'pbh_sirgas',
    PbhBase = 'pbh_base'
}

export function getWorkspaceByCamada(camadaEnum: CamadasEnum) {

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
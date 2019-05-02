import { CamadasEnum } from './camadasEnum';
export declare enum WorspaceCamadaEnum {
    BhGeo = "ide_bhgeo",
    Sirgas = "pbh_sirgas",
    PbhBase = "pbh_base"
}
export declare function getWorkspaceByCamada(camadaEnum: CamadasEnum): WorspaceCamadaEnum;

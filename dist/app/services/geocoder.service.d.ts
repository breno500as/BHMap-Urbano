import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BhMap } from '../models/bhMap';
export declare class GeocoderService {
    private httpClient;
    constructor(httpClient: HttpClient);
    recuperaEnderecoPorGeometria(longitude: string, latitude: string, isProduction: boolean): Observable<Object>;
    recuperaEnderecosPorLogradouro(nomeLogradouro: string, numero: number, isProduction: boolean): Observable<any>;
    zoomEndereco(endereco: any, bhMap: BhMap): void;
    getPonto(endereco: any): Array<any>;
}


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { filtroEndereco, getUrlGeocoder } from '../helpers/utils';
import { BhMap } from '../models/bhMap';

@Injectable()
export class GeocoderService {

    constructor(private httpClient: HttpClient) {
    }

    recuperaEnderecoPorGeometria(longitude: string, latitude: string, isProduction: boolean) {
        const pontoWKT = `POINT(${longitude}  ${latitude})`;
        return this.httpClient.get(`${getUrlGeocoder(isProduction)}geocoder/v2/coordinate?ponto=${pontoWKT}`);
    }

    recuperaEnderecosPorLogradouro(nomeLogradouro: string, numero: number, isProduction: boolean): Observable<any> {

        if (!nomeLogradouro) {
            alert('É obrigatório informar o nome do logradouro.');
            return;
        }

        const newEndereco = nomeLogradouro.toLowerCase().replace(filtroEndereco, '');
        nomeLogradouro = newEndereco.toUpperCase().trim();

        let params = `?logradouro=${nomeLogradouro}`;
        if (numero) {
            params += `&numero=${numero}`;
        }

        return this.httpClient.get(`${getUrlGeocoder(isProduction)}geocoder/v2/address${params}`);
    }
    zoomEndereco(endereco: any, bhMap: BhMap) {
        const latitudeLongitude = this.getPonto(endereco);
        bhMap.centerMap([latitudeLongitude[0], latitudeLongitude[1]]);
    }
    getPonto(endereco: any): Array<any> {
        const cordenadas = endereco.wkt;
        const busca = 'POINT(';
        const ini = cordenadas.indexOf(busca) + busca.length;
        const fim = cordenadas.indexOf(')', ini);
        const lonLat: Array<any> = cordenadas.substr(ini, fim - ini).split(' ');
        return lonLat;
    }

}

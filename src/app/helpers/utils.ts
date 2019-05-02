export const filtroEndereco = /rua\s+|avenida\s+|praca\s+|praça\s+|ave\s+|av.\s+|ave.\s+/gi;

export const idAreaTrechoLogradouro = 'ID_AREA_TRECHO_LOGRADOURO';

export const caminhoMetadados = 'v2/api/metacamada';

export const epsg = 'EPSG:31983';

export function formataEndereco(endereco: any) {
    return `${endereco.tipologradouro} ${endereco.nomelogradouro} , Nº ${endereco.numero}`;
}

export function concatInQueryParams(queryFilterObject: any) {
    return Object.keys(queryFilterObject).map((key) => `${key}=${queryFilterObject[key]}`).join('&');
}

export function getUrlBhMap(isProduction: boolean) {

    if (isProduction) {
        return 'http://bhmap.pbh.gov.br/';
    }

    return 'http://bhmap-hm.pbh.gov.br/';
}

export function getUrlCamadas(isProduction: boolean) {

    if (isProduction) {
        return 'http://bhmapogcbase.pbh.gov.br/bhmapogcbase/';
    }

    return 'http://bhmapogcbase-hm.pbh.gov.br/bhmapogcbase/';
}


export function getUrlGeocoder(isProduction: boolean) {

    if (isProduction) {
        return 'http://geocoder.pbh.gov.br/';
    }

    return 'http://geocoder-hm.pbh.gov.br/';

}

export function distinctArrayByProperties(array: any, prop: any, prop2: any) {

    return array.reduce((currentArray: Array<any>, item: any) => {
       if (!currentArray.find(currentItem => currentItem[prop2] === item[prop][prop2])) {
            currentArray.push(item[prop]);
        }
        return currentArray;
    }, []);
}

export function distinctArrayByProperty(array: any, prop: any) {

    return array.reduce((currentArray: Array<any>, item: any) => {
        if (!currentArray.find(currentItem => currentItem[prop] === item[prop])) {
             currentArray.push(item);
         }
        return currentArray;
      }, []);
}

export function calculaAreaImagemPorGeometrias(geometrias: any, buffer: number) {

    const layers = new window['nomeObjetoOpenLayers'].Geometry.Collection();

    geometrias.forEach((geometria: any) => {
        layers.addComponent(geometria.geometry);
    });

    layers.calculateBounds();

    // pega o bounding box do conjunto
    const oldBB = layers.getBounds();

    // faz um buffer ao redor da area
    const newBB = new window['nomeObjetoOpenLayers'].Bounds(oldBB.left - buffer, oldBB.bottom - buffer, oldBB.right + buffer, oldBB.top + buffer);
    return newBB;
}


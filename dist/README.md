Projeto construído com o OpenLayers 6.

## Instalação

```bash
$ npm install git+http://gitlab.pbh.gov.br/regulacao_urbana/Licenciamento/BHMap-Urbano.git  --save 
```

## Utilização

No 'AppModule' ou 'SharedModule' da aplicação adicione:

```typescript
import { AppComponent } from './app.component';
import { BhMapModule } from 'bhmap';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BhMapModule // <============
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```


No componente que desejar adicione o array de camadas:

```typescript
import { CamadasEnum, TipoCamada, ObjetoOutputMapa } from 'bhmap';

@Component({})
export class ExemploComponent implements OnInit { 
  
   tiposCamadas = [new TipoCamada({ camadaEnum: CamadasEnum.Endereco })];  // <============

   ngOnInit() {
   }
}
```

No template do mesmo componente adicione:

```xml
 
    <app-bhmap 
        (emitter)="callbackMapa($event)" 
        [tiposCamadas]="tiposCamadas" 
        [caminhoServidorProxyBhmap]="caminhoServidorProxyBhmap"
        [isProduction]="productionMap"> 
    </app-bhmap>

```

## Customizações e explicações em geral

O componente

```xml 
<app-bhmap> 
```

 - emitter - Emite um objeto de callback: ObjetoOutputMapa.ts  (Contém um array de objetos de retorno e as urls dos pontos selecionados para gerar imagens do  mapa).
 - tiposCamadas - Input requerido que carrega as camadas do mapa e seus callbacks de retorno. Um array de TipoCamada.ts que pode ser configurado com várias propriedades.
 - caminhoServidorProxyBhmap - Input requerido com uma string que representa o caminho do servidor proxy de backend (para chamadas seguras pelo protocolo https).
 - isProduction - Input que deve ser carregado com uma varíavel de environment (production por exemplo) para que as urls do mapa sejam carregadas de acordo com o ambiente.
 - painelSelecaoCamadas - Input opcional que desenha um painel de seleção de camadas no mapa. Associado a cada camada um checkbox será exibido para controles de visibilidade (exibir ou não a camada).

O objeto de configuração TipoCamada.ts

```typescript
export class TipoCamada {

    camadaEnum: CamadasEnum;
    camadaPrincipal?: boolean; 
    tipoControlePontoEnum?: TipoControlePontoEnum;
    visivel?: boolean;
    opacidade?: boolean;
    descricao?: string; 
    selecionado?: boolean; 
    habilitado?: boolean;
    id?: number;

    constructor(params: TipoCamada = {} as TipoCamada) {
        this.camadaEnum = params.camadaEnum;
        this.camadaPrincipal = params.camadaPrincipal === undefined ? true : params.camadaPrincipal;
        this.tipoControlePontoEnum = params.tipoControlePontoEnum ? 
         params.tipoControlePontoEnum : TipoControlePontoEnum.ponto;
        this.visivel = params.visivel === undefined ? true : params.visivel;
        this.descricao = params.descricao;
        this.selecionado = params.selecionado === undefined ? false : params.selecionado;
        this.habilitado = params.habilitado  === undefined ?  true : params.habilitado;
        this.id = params.id;
    }
}
```

- camadaEnum - Enum que contém o caminho / id de recuperação da camada no servidor de backend do bhmaps.
- camadaPrincipal - Um booleano que representa se é a camada principal, DEVE existir uma ÚNICA camada principal no array de camadas. Essa camada é a camada onde seram
buscados os valores a serem emitidos pelo componente do mapa. Exemplo: camadaPrincipal = true para CamadasEnum.Endereco retorna os dados do endereço. O valor default é true.
- tipoControlePontoEnum - O tipo de controle da camada, disponível em TipoControlePontoEnum.ts (ponto, poligono, trajeto, box). O valor default é ponto.
- visivel - Se a camada é vísivel ou não. O valor default é true.
- opacidade - Indica a opacidade da camada. O valor default é 0.5.

 Caso o @Input() painelSelecaoCamadas seja true as seguintes propriedades podem ser configuradas:

- descricao - A descrição da camada que irá aparecer no checkbox de seleção de camadas.
- selecionado - O valor do checkbox selecionado true ou false. O valor default é false.
- habilitado - Se o checkbox da camada irá ficar habilitado, existem camadas que não devem ter sua visibilidade alterada pelo usuário.  O valor default é true.
- id - Id para diferenciação das camadas no momento de alterar a visibilidade.


## Gerando o build

Para gerar o build dos arquivos compilados referentes a esse projeto execute:

```bash
$ npm run pack
```
Após o build comite e de um push do código no repositório.

O build é gerado com a ferramenta: https://github.com/ng-packagr/ng-packagr que implementa as boas práticas de transpilação de arquivos determinadas pelo Angular:
https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview

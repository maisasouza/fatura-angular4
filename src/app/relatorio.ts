export class Relatorio {
    referencia: Date;
    banco: string;
    totalFatura: number;
    totalMaisa: number;
    totalElias: number;
    totalNaoAtribuido: number;

    constructor () {
        this.totalFatura = 0;
        this.totalElias = 0;
        this.totalMaisa = 0;
        this.totalNaoAtribuido = 0;
    }
}

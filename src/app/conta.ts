export class Conta {
    referencia: Date; //Referencia da fatura de pagamento -- sempre sera considerado dia 1
    data: Date; //Data da compra
    banco: string;
    valor: number;
    descricao: string;
    responsavel?: string;
    valorEmDolar?: number;
    categorias?: string[];
    numeroParcela?: number;
    totalParcels?: number;

    printConta() {
        console.log('Referencia: ' + this.referencia);
        console.log('Data: ' + this.data);
        console.log('Descricao: ' + this.descricao);
        console.log('Valor: ' + this.valor);
        console.log('Responsavel: ' + this.responsavel);
    }
}

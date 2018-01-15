export class Conta {
    _id?: any;
    referencia: MongoData; //Referencia da fatura de pagamento -- sempre sera considerado dia 1
    data: MongoData; //Data da compra
    banco: string;
    valor: number;
    descricao: string;
    responsavel?: string;
    valorEmDolar?: number;
    categorias?: string[];
    numeroParcela?: number;
    totalParcels?: number;

    constructor() {
        this.referencia = new MongoData();
        this.data = new MongoData();
    }

    printConta() {
        if (this._id) {
            console.log('Id: ' + this._id);
        }
        console.log('Referencia: ' + this.referencia.$date);
        console.log('Data: ' + this.data.$date);
        console.log('Descricao: ' + this.descricao);
        console.log('Valor: ' + this.valor);
        console.log('Responsavel: ' + this.responsavel);
    }
}

export class MongoData {
    $date: Date;
}

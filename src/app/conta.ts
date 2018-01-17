export class Conta {
    _id?: any;
    referencia: MongoData; //Referencia da fatura de pagamento -- sempre sera considerado dia 1
    data: MongoData; //Data da compra
    ordemInsercao: number;
    banco: string;
    valor: number;
    descricao: string;
    responsavel?: string;
    valorEmDolar?: number;
    categorias?: string[] = new Array<string>();
    numeroParcela?: number;
    totalParcels?: number;
    observacao?: string;

    constructor() {
        this.referencia = new MongoData();
        this.data = new MongoData();
        this.categorias = new Array<string>();
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

    categoriasToString = function () {
        if (this.categorias !== undefined && this.categorias.length > 0) {
            let strCategoria = '';

            this.categorias.forEach((cat: string) => {
                strCategoria += cat + ', ';
            });

            strCategoria = strCategoria.substring(0, strCategoria.length - 1);
            return strCategoria;
        } else {
            return '';
        }
    };
}

export class MongoData {
    $date: Date;
}

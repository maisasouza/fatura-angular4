import { Component, OnInit } from '@angular/core';
import { forEach } from '@angular/router/src/utils/collection';
import { Conta } from '../conta';

@Component({
  selector: 'app-nova-fatura',
  templateUrl: './nova-fatura.component.html',
  styleUrls: ['./nova-fatura.component.css']
})
export class NovaFaturaComponent implements OnInit {

  bancos = ['Bradesco', 'BB', 'Itau', 'Avulsos'];
  rateio = ['Maisa', 'Elias', 'Rateio'];
  referencia: string;
  bancoSelecionado: string;
  faturaCarregada = false;
  itensFatura: Array<Conta>;
  self = this;
  totalConta = 0;

  resumoConta = {
    totalConta: 0,
    restanteNaoAtribuido: 0,
    totalMaisa: 0,
    totalElias: 0
  };


  constructor() { }

  ngOnInit() {
    this.bancoSelecionado = this.bancos[0];
  }

  reiniciaVariaveis() {
    this.resumoConta = {
      totalConta: 0,
      restanteNaoAtribuido: 0,
      totalMaisa: 0,
      totalElias: 0
    };
  }

  carregarFatura() {
    console.log('Teoricamente carreguei a fatura');
    this.faturaCarregada = true;
  }

  lerArquivo(event: any) {
    const self = this;
    const fileReader = new FileReader();
    fileReader.onload = function () {
      const conteudo = fileReader.result;
      console.log(self.bancoSelecionado)
      if (self.bancoSelecionado === 'Bradesco') {
        self.preencherFaturaBradesco(conteudo, self);
      }
      self.preencherItensFatura(conteudo);
    };

    fileReader.readAsText(event.srcElement.files[0]);
  }


  preencherFaturaBradesco(conteudoArquivo: string, self: any) {
    const listaValores = conteudoArquivo.split('\n');

    self.itensFatura = new Array<Conta>();

    listaValores.forEach(function(linha, ind, arr){
      if (self.isLinhaValida(linha)) {
        const camposDaLinha = linha.split(/\s{10,50}/);

        const novaConta = new Conta();
        const mesReferencia = self.referencia.substring(0, 2) - 1;
        const anoReferencia = self.referencia.substring(3, 7);
        const mesCompra = parseInt(linha.substring(3, 5), 10) - 1;
        const anoCompra = (mesCompra <= mesReferencia) ? anoReferencia : anoReferencia - 1;

        novaConta.referencia = new Date(anoReferencia, mesReferencia, 1);
        novaConta.data = new Date(anoCompra, mesCompra, parseInt(linha.substring(0, 2), 10));
        novaConta.descricao = camposDaLinha[1];
        novaConta.valorEmDolar = Number(camposDaLinha[2].replace('.', '').replace(',', '.'));
        novaConta.valor = Number(camposDaLinha[3].replace('.', '').replace(',', '.'));

        self.itensFatura.push(novaConta);
        self.totalConta += novaConta.valor;
      }
    });

    self.calcularTotais();
  }

  isLinhaValida (linha: string) {
    const data = linha.substring(0, 5);
    return (data.match('[0-9][0-9]/[0-1][0-9]'))
  }


  preencherItensFatura = (conteudoArquivo: string) => {
      // const listaValores = conteudoArquivo.split('/n');
      // console.log('Length: ' + listaValores.length );
  }

  excluirItemFatura(itemCompra: Conta) {

    const index = this.itensFatura.indexOf(itemCompra);

    if (index === -1) {
      console.log('ERRO - Não deveria excluir uma compra que nao está na lista');
    } else {
      this.itensFatura.splice(index, 1);
      this.calcularTotais();
    }
  }

  calcularTotais() {
    console.log('Entrei no calcular totais');
    this.reiniciaVariaveis();
    const self = this;
    this.itensFatura.forEach(function(element, ind, arr){
      self.resumoConta.totalConta += element.valor;

      switch (element.responsavel) {
        case 'Elias':
          self.resumoConta.totalElias += element.valor;
          break;
        case 'Maisa':
          self.resumoConta.totalMaisa += element.valor;
          break;
        case 'Rateio':
          self.resumoConta.totalElias += element.valor / 2;
          self.resumoConta.totalMaisa += element.valor / 2;
          break;
      }

      self.resumoConta.restanteNaoAtribuido = self.resumoConta.totalConta - self.resumoConta.totalElias - self.resumoConta.totalMaisa;
    });
  }


  salvarFatura() {

  }

  /**
   * Exclusao se dará por referência e banco.
   */
  excluirFatura() {

  }
}

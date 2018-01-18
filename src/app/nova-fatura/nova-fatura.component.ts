import { Component, OnInit } from '@angular/core';
import { forEach } from '@angular/router/src/utils/collection';
import { Conta } from '../conta';
import { PersistenciaService } from 'app/persistencia.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NovaContaModalComponent } from 'app/nova-conta-modal/nova-conta-modal.component';
import { RelatoriosComponent } from 'app/relatorios/relatorios.component';

@Component({
  selector: 'app-nova-fatura',
  templateUrl: './nova-fatura.component.html',
  styleUrls: ['./nova-fatura.component.css']
})
export class NovaFaturaComponent implements OnInit {

  bancos = ['Bradesco', 'BB', 'Itau', 'Avulsos'];
  rateio = ['Maisa', 'Elias', 'Rateio'];
  categorias = ['uber', 'almoco', 'supermercado', 'martplus/verdemar/padaria',
    'restaurantes', 'viagens', 'dogs', 'compras pessoais', 'carro', 'casa', 'farmacia'];

  referenciaMask = [/[0-1]/, /[0-9]/, '/', /[2]/, /[0]/, /[1-9]/, /[0-9]/];
  referencia: string;
  bancoSelecionado: string;
  faturaCarregada = false;
  itensFatura: Array<Conta> = new Array<Conta>();
  self = this;
  totalConta = 0;
  naoExisteFaturaNoBanco = false;
  mensagemSucesso: string;
  mensagemErro: string;
  mensagemInfo: string;
  modoAvulso = false;

  resumoConta = {
    totalConta: 0,
    restanteNaoAtribuido: 0,
    totalMaisa: 0,
    totalElias: 0
  };


  constructor(private persistenciaService: PersistenciaService, private modalService: NgbModal) { }

  ngOnInit() {
    this.bancoSelecionado = this.bancos[0];
  }

  resetMensagens() {
    const self = this;
    setTimeout(function(){
      self.mensagemSucesso = undefined;
      self.mensagemErro = undefined;
      self.mensagemInfo = undefined;
    }, 3000);
  }

  reiniciaVariaveis() {
    this.resumoConta = {
      totalConta: 0,
      restanteNaoAtribuido: 0,
      totalMaisa: 0,
      totalElias: 0
    };
  }

  limparTela() {
    this.referencia = undefined;
    this.bancoSelecionado = this.bancos[0];
    this.itensFatura = new Array<Conta>();
    this.reiniciaVariaveis();
    this.faturaCarregada = false;
    this.naoExisteFaturaNoBanco = false;
    this.modoAvulso = false;
  }

  verificaModoAvulso() {
    this.modoAvulso = this.bancoSelecionado === 'Avulsos';
  }

  adicionarContaManual() {
    const self = this;
    if (this.validaReferencia()) {
      const modalRef = this.modalService.open(NovaContaModalComponent);
      modalRef.componentInstance.referencia = this.getReferenciaFormatoDate();
      modalRef.result.then(res => {if (res) { self.itensFatura.push(res); self.calcularTotais() } });
    }
  }

  validaReferencia() {
    if (this.referencia === null || this.referencia === undefined ||
      !this.referencia.match('[0-1][0-9]/[2][0][1-9][0-9]')) {
      this.mensagemErro = 'Referência deve ser preenchida no formato mm/yyyyy, com meses e anos válidos(a partir de 2010).';
      this.resetMensagens();
      return false;
    }

    return true;
  }

  getReferenciaFormatoDate() {
    const mesReferencia = parseInt(this.referencia.substring(0, 2), 10) - 1;
    const anoReferencia = this.referencia.substring(3, 7);

    return new Date(parseInt(anoReferencia, 10), mesReferencia, 1);
  }

  carregarFatura() {
    if (this.validaReferencia()) {
      const dataReferencia = this.getReferenciaFormatoDate();

      this.persistenciaService.getContasPorReferenciaEBanco(dataReferencia, this.bancoSelecionado).subscribe((data) => {
        this.faturaCarregada = true;
        if (data !== null && data.length > 0) {
          this.itensFatura = data;
          this.calcularTotais();
        } else {
          this.mensagemInfo = 'Não existem faturas no BD dessa referência/banco. ';
          this.resetMensagens();
          this.naoExisteFaturaNoBanco = true;
        }
      });
    }
  }

  lerArquivo(event: any) {
    const self = this;
    const fileReader = new FileReader();
    this.itensFatura = new Array<Conta>();
    this.reiniciaVariaveis();

    fileReader.onload = function () {
      const conteudo = fileReader.result;
      if (self.bancoSelecionado === 'Bradesco') {
        self.preencherFaturaBradesco(conteudo, self);
      } else if (self.bancoSelecionado === 'Itau') {
        self.preencherFaturaItau(conteudo, self);
      } else if (self.bancoSelecionado === 'BB') {
        self.preencherFaturaBB(conteudo, self);
      }
    };

    fileReader.readAsText(event.srcElement.files[0]);
  }


  preencherFaturaBradesco(conteudoArquivo: string, self: any) {
    const listaValores = conteudoArquivo.split('\n');
    let ordem = 1;

    listaValores.forEach(function(linha, ind, arr){
      if (self.isLinhaValida(linha)) {
        const camposDaLinha = linha.split(/\s{10,50}/);

        const novaConta = new Conta();
        const mesReferencia = self.referencia.substring(0, 2) - 1;
        const anoReferencia = self.referencia.substring(3, 7);
        const mesCompra = parseInt(linha.substring(3, 5), 10) - 1;
        const anoCompra = (mesCompra <= mesReferencia) ? anoReferencia : anoReferencia - 1;

        novaConta.referencia.$date = self.getReferenciaFormatoDate();
        novaConta.data.$date = new Date(anoCompra, mesCompra, parseInt(linha.substring(0, 2), 10));
        novaConta.banco = self.bancoSelecionado;
        novaConta.descricao = camposDaLinha[1];
        novaConta.valorEmDolar = Number(camposDaLinha[2].replace('.', '').replace(',', '.'));
        novaConta.valor = Number(camposDaLinha[3].replace('.', '').replace(',', '.'));
        novaConta.ordemInsercao = ordem;

        self.itensFatura.push(novaConta);
        self.totalConta += novaConta.valor;
        ordem++;
      }
    });

    self.calcularTotais();
  }

  preencherFaturaItau(conteudoArquivo: string, self: any) {
    const listaValores = conteudoArquivo.split('\n');
    let ordem = 1;

    listaValores.forEach(function(linha, ind, arr){
      if (self.isLinhaValida(linha)) {
        const camposDaLinha = linha.split('\t');

        const novaConta = new Conta();
        const mesReferencia = self.referencia.substring(0, 2) - 1;
        const anoReferencia = self.referencia.substring(3, 7);
        const mesCompra = parseInt(linha.substring(3, 5), 10) - 1;
        const anoCompra = (mesCompra <= mesReferencia) ? anoReferencia : anoReferencia - 1;

        novaConta.referencia.$date = self.getReferenciaFormatoDate();
        novaConta.data.$date = new Date(anoCompra, mesCompra, parseInt(linha.substring(0, 2), 10));
        novaConta.banco = self.bancoSelecionado;
        novaConta.descricao = camposDaLinha[1];
        // novaConta.valorEmDolar = Number(camposDaLinha[2].replace('.', '').replace(',', '.'));
        novaConta.valor = Number(camposDaLinha[2].replace('.', '').replace(',', '.'));
        novaConta.ordemInsercao = ordem;

        self.itensFatura.push(novaConta);
        self.totalConta += novaConta.valor;
        ordem++;
      }
    });

    self.calcularTotais();
  }

  preencherFaturaBB(conteudoArquivo: string, self: any) {
    const listaValores = conteudoArquivo.split('\n');
    let ordem = 1;

    listaValores.forEach(function(linha, ind, arr) {
      if (self.isLinhaValida(linha)) {

        const novaConta = new Conta();
        const mesReferencia = self.referencia.substring(0, 2) - 1;
        const anoReferencia = self.referencia.substring(3, 7);
        const mesCompra = parseInt(linha.substring(3, 5), 10) - 1;
        const anoCompra = (mesCompra <= mesReferencia) ? anoReferencia : anoReferencia - 1;

        novaConta.referencia.$date = self.getReferenciaFormatoDate();
        novaConta.data.$date = new Date(anoCompra, mesCompra, parseInt(linha.substring(0, 2), 10));
        novaConta.banco = self.bancoSelecionado;
        novaConta.descricao = linha.substring(10, 49);
        novaConta.valor = Number(linha.substring(50, 69).replace('.', '').replace(',', '.'));
        novaConta.valorEmDolar = Number(linha.substring(70, 81).replace('.', '').replace(',', '.'));
        novaConta.ordemInsercao = ordem;

        self.itensFatura.push(novaConta);
        self.totalConta += novaConta.valor;
        ordem++;
      }
    });

    self.calcularTotais();
  }

  isLinhaValida (linha: string) {

    if (this.bancoSelecionado === 'Itau' || this.bancoSelecionado === 'Bradesco') {
      const data = linha.substring(0, 5);
      return (data.match('[0-9][0-9]/[0-1][0-9]'))
    } else {
      const data = linha.substring(0, 10);
      return data.match('[0-3][0-9]\.[0-1][0-9]\.[2][0][1-9][0-9]');
    }
  }

  excluirItemFatura(itemCompra: Conta) {
    const index = this.itensFatura.indexOf(itemCompra);

    if (index === -1) {
      console.log('ERRO - Não deveria excluir uma compra que nao está na lista');
    } else {
      if (itemCompra._id !== undefined) {
        this.persistenciaService.removeContaEspecifica(itemCompra).subscribe((res)=>{
          console.log('Conta removida com sucesso !');
        });
      }
      this.itensFatura.splice(index, 1);
      this.calcularTotais();
    }
  }

  calcularTotais() {
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
    let deuErro = false;
    this.itensFatura.forEach((element) => {
      if (element._id !== undefined && element._id !== null) {
        this.persistenciaService.editaContaEspecifica(element).subscribe(success => {}, error => {
          console.log('Erro persistencia conta: ' + element.descricao);
          deuErro = true;
        });
      } else {
        this.persistenciaService.adicionarContas([element]).subscribe(success => {}, error => {
          console.log('Erro persistencia conta: ' + element.descricao);
          deuErro = true;
        });
      }
    });

    this.mensagemInfo = 'Acompanhar console(F12) pra ver se nao deu erro por enquanto';
    this.resetMensagens();
  }

  /**
   * Exclusao se dará por referência e banco.
   */
  excluirFatura() {
    const dataReferencia = this.getReferenciaFormatoDate();
    const self = this;

    this.persistenciaService.removeContasPorReferenciaEBanco(dataReferencia, this.bancoSelecionado).subscribe((data: any) => {
      self.itensFatura = new Array<Conta>();
      self.mensagemSucesso = data.removed + ' contas removidas com sucesso. ' + data.n + ' com erros.';
      self.resetMensagens();
    }, (error) => {
      self.mensagemErro = 'Erro na exclusão. Olhar console (F12).';
      self.resetMensagens();
      console.log(error);
    });
  }
}

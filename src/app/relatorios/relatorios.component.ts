import { Component, OnInit } from '@angular/core';

import { Conta } from '../conta';
import { Relatorio } from '../relatorio';
import { PersistenciaService } from 'app/persistencia.service';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent implements OnInit {

  bancos = ['Bradesco', 'BB', 'Itau', 'Avulsos'];
  rateio = ['Maisa', 'Elias', 'Rateio'];
  referenciaMask = [/[0-1]/, /[0-9]/, '/', /[2]/, /[0]/, /[1-9]/, /[0-9]/];
  referencia: string;
  resultado = new Array<Relatorio>();
  consolidado = new Relatorio();
  mensagemErro: string;

  constructor(private persistenciaService: PersistenciaService) { }

  ngOnInit() {
  }

  limparTela() {
    this.referencia = undefined;
    this.resultado = new Array<Relatorio>();
    this.consolidado = new Relatorio();
    this.mensagemErro = undefined;
  }

  verRelatorio() {
    const self = this;
    this.resultado = new Array<Relatorio>();
    this.consolidado = new Relatorio();
    
    if (this.validaReferencia()) {
      this.bancos.forEach(banco => {
        const referencia = self.getReferenciaFormatoDate();

        self.persistenciaService.getContasPorReferenciaEBanco(referencia, banco).subscribe(contas => {
          const relatorio = self.calculaRelatorio(referencia, banco, contas);
          self.resultado.push(relatorio);

          self.consolidado.totalFatura += relatorio.totalFatura;
          self.consolidado.totalElias += relatorio.totalElias;
          self.consolidado.totalMaisa += relatorio.totalMaisa;
          self.consolidado.totalNaoAtribuido += relatorio.totalNaoAtribuido;
        });
      });
    }
  }

  calculaRelatorio(ref: Date, banco: string, contas: Conta[]) {
    const relatorio = new Relatorio();
    relatorio.referencia = ref;
    relatorio.banco = banco;

    this.calculaTotais(contas, relatorio);

    return relatorio;
  }

  calculaTotais(contas: Conta[], relatorio: Relatorio) {
    contas.forEach((conta) => {
      relatorio.totalFatura += conta.valor;

      switch (conta.responsavel) {
        case 'Elias':
          relatorio.totalElias += conta.valor;
          break;
        case 'Maisa':
          relatorio.totalMaisa += conta.valor;
          break;
        case 'Rateio':
          relatorio.totalElias += conta.valor / 2;
          relatorio.totalMaisa += conta.valor / 2;
          break;
        default:
          relatorio.totalNaoAtribuido += conta.valor;
          break;
      }
    });


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

  resetMensagens() {
    const self = this;
    setTimeout(function () {
      self.mensagemErro = undefined;
    }, 3000);
  }

}

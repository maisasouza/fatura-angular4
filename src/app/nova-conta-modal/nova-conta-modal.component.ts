import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Conta } from '../conta';

@Component({
  selector: 'app-nova-conta-modal',
  templateUrl: './nova-conta-modal.component.html',
  styleUrls: ['./nova-conta-modal.component.css']
})
export class NovaContaModalComponent implements OnInit {


  @Input() referencia: Date;
  dataCompraMask = [/[0-3]/, /[0-9]/, '/', /[0-1]/, /[0-9]/];
  dataCompra: string;
  novaConta: Conta;
  mensagemErro: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit () {
    this.novaConta = new Conta();
    this.mensagemErro = undefined;
  }

  adicionarConta() {
    if (this.dataCompra === undefined ||
      this.novaConta.descricao === undefined ||
      this.novaConta.valor === undefined) {

      this.mensagemErro = 'Todos os campos são obrigatórios';
    } else {
      const mesCompra = Number(parseInt(this.dataCompra.substring(3, 5), 10) - 1);
      const diaCompra = Number(parseInt(this.dataCompra.substring(0, 2), 10));
      const anoCompra = (mesCompra > this.referencia.getMonth()) ? this.referencia.getFullYear() - 1 : this.referencia.getFullYear();

      this.novaConta.data.$date = new Date(anoCompra, mesCompra, diaCompra);
      this.novaConta.banco = 'Avulsos';
      this.novaConta.referencia.$date = this.referencia;

      console.log('Nova conta adicionada manualmente');
      console.log(this.novaConta);

      this.activeModal.close(this.novaConta);
    }
  }
}

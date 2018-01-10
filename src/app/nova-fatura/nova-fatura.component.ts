import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nova-fatura',
  templateUrl: './nova-fatura.component.html',
  styleUrls: ['./nova-fatura.component.css']
})
export class NovaFaturaComponent implements OnInit {

  bancos = ['BB', 'Bradesco', 'Itau', 'Avulsos'];
  referencia: string;
  bancoSelecionado: string;
  faturaCarregada = false;
  itensFatura = [];
  self = this;


  constructor() { }

  ngOnInit() {
    this.bancoSelecionado = this.bancos[0];
  }

  carregarFatura() {
    console.log('Teoricamente carreguei a fatura');
    this.faturaCarregada = true;
  }

  lerArquivo(event) {
    const self = this;
    const fileReader = new FileReader();
    fileReader.onload = function () {
      const conteudo = fileReader.result;
      self.preencherItensFatura(conteudo);
    };

    fileReader.readAsText(event.srcElement.files[0]);
  }


  preencherItensFatura = (conteudoArquivo) => {
      const listaValores = conteudoArquivo.split('/n');
      console.log('Length: ' + listaValores.length );
      console.log(listaValores);
  }
}

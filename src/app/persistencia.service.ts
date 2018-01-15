import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class PersistenciaService {

  constructor(private http: HttpClient) { }


  getContasPorReferenciaEBanco(referencia: Date, banco: string) {

  }

  removeContasPorReferenciaEBanco(referencia: Date, banco: string) {

  }

}

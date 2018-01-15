import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Conta } from './conta';


@Injectable()
export class PersistenciaService {

  header: HttpHeaders;

  constructor(private http: HttpClient) {
    this.header = new HttpHeaders();
    this.header.set('Content-Type', 'application/json');
   }


  public getContasPorReferenciaEBanco(referencia: Date, banco: string) {

    const query = {
      'banco': banco,
      'referencia': {
        '$date': referencia.toISOString()
      }
    };

    return this.http.get<Conta[]>
      ('https://api.mlab.com/api/1/databases/faturadb/collections/contas?apiKey=X9Bn4_SbDdHZv8FekcL6CVCA35chhKGh&q=' + JSON.stringify(query));
  }

  public removeContasPorReferenciaEBanco(referencia: Date, banco: string) {
    const query = {
      'banco': banco,
      'referencia': {
        '$date': referencia.toISOString()
      }
    };

    return this.http.put('https://api.mlab.com/api/1/databases/faturadb/collections/contas?apiKey=X9Bn4_SbDdHZv8FekcL6CVCA35chhKGh&q=' + JSON.stringify(query), []);
  }

  public removeContaEspecifica(conta: Conta) {
    return this.http.delete('https://api.mlab.com/api/1/databases/faturadb/collections/contas/'+ conta._id.$oid +'?apiKey=X9Bn4_SbDdHZv8FekcL6CVCA35chhKGh&q=');
  }

  public adicionarContas(contas: Conta[]) {
    return this.http.post('https://api.mlab.com/api/1/databases/faturadb/collections/contas?apiKey=X9Bn4_SbDdHZv8FekcL6CVCA35chhKGh',
    contas);
  }

}


/**
 * List DBs --> https://api.mlab.com/api/1/databases?apiKey=X9Bn4_SbDdHZv8FekcL6CVCA35chhKGh
 * List collections --> https://api.mlab.com/api/1/databases/faturadb/collections?apiKey=X9Bn4_SbDdHZv8FekcL6CVCA35chhKGh
 * List documents --> https://api.mlab.com/api/1/databases/faturadb/collections/contas?apiKey=X9Bn4_SbDdHZv8FekcL6CVCA35chhKGh
 * Query example --> https://api.mlab.com/api/1/databases/faturadb/collections/conta?q={"banco": true}&apiKey=X9Bn4_SbDdHZv8FekcL6CVCA35chhKGh
 */
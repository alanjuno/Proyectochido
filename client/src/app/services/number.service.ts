import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NumberService {
  operacion = '';
  o1 = 0;
  signo = false;
  mirame$ = new Subject<string>();
  resultado$ = new Subject<number>();
  ss: string;
  _ss = [];
  operac: number;
  constructor(private http: HttpClient) { }
  op(teclas: any): Observable<string> {
    if (this.o1 > 0 && this.ss === '' && !isNaN(teclas)) {
      this.operacion = '0';
      this.o1 = 0;
      this.resultado$.next(0);
    }
    switch (teclas) {
      case 0:
        if (this.operacion !== '0') {
          this.operacion = this.operacion + '0';
        }

        break;
      case 1:
        if (!this.sicero('1')) {
          this.operacion = this.operacion + '1';
        }
        break;
      case 2:
        if (!this.sicero('2')) {
          this.operacion = this.operacion + '2';

        }
        break;
      case 3:
        if (!this.sicero('3')) {
          this.operacion = this.operacion + '3';

        }
        break;
      case 4:
        if (!this.sicero('4')) {
          this.operacion = this.operacion + '4';
        }
        break;
      case 5:
        if (!this.sicero('5')) {
          this.operacion = this.operacion + '5';

        }
        break;
      case 6:
        if (!this.sicero('6')) {
          this.operacion = this.operacion + '6';
        }
        break;
      case 7:
        if (!this.sicero('7')) {
          this.operacion = this.operacion + '7';
        }
        break;
      case 8:
        if (!this.sicero('8')) {
          this.operacion = this.operacion + '8';
        }
        break;
      case 9:
        if (!this.sicero('9')) {
          this.operacion = this.operacion + '9';

        }
        break;
      case '/':
        this.logicOpera('/');
        this.ss = '/';
        this._ss.push('/');
        break;
      case 'x':
        this.logicOpera('*');
        this.ss = '*';
        this._ss.push('*');
        break;
      case '+':
        this.logicOpera('+');
        this.ss = '+';
        this._ss.push('+');
        break;
      case 'c':
        this.operacion = this.operacion.substring(0, ((this.operacion.length) - 1));
        if (this.operacion.length === 0) {
          this.signo = false;
          this.o1 = 0;
          this.resultado$.next(0);
          this.operacion = '0';
          this.operac = 0;
          this.ss = '';
          this._ss.length = 0;
        }
        break;
      case '-':
        this.logicOpera('-');
        this.ss = '-';
        this._ss.push('-');
        break;
      case '.':
        if (this.operacion.indexOf('.') === -1) {
          this.operacion = this.operacion + '.';
        }
        break;
    }
    if (!this.signo && this.o1 === 0) {
      this.mirame$.next(this.operacion);
    } else {
      if (this.ss === '') {
        this.mirame$.next(this.operacion);
      } else {
        this.mirame$.next(this.o1 + this.ss + this.operacion);
      }
      this.mirame$.next(this.o1 + this.ss + this.operacion);
    }

    return this.mirame$.asObservable();

  }
  logicOpera(sy: string) {
    if (!this.signo && this.o1 === 0) {
      this.o1 = parseFloat(this.operacion);
      this.operacion = '0';
      this.signo = true;
    } else {
      if (this.o1 > 0 && !this.signo) {
        this.mirame$.next(this.o1 + this.ss + this.operacion);
        this._ss.push(sy);
        this.ss = sy;
        this.signo = true;
      } else {
        if (this._ss.length < 2 || this._ss[(this._ss.length - 1)] === sy) {
          this.o1 = this.opera(this.o1, this.operacion, sy);
        } else {
          this.o1 = this.opera(this.o1, this.operacion, this._ss[(this._ss.length - 1)]);
        }
        this.resultado$.next(this.o1);
        this.operacion = '0';
      }

    }
  }
  opera(op1, op2, sig) {
    switch (sig) {
      case '+':
        this.operac = (op1 + parseFloat(op2));
        break;
      case '-':
        this.operac = (op1 - parseFloat(op2));
        break;
      case '/':
        this.operac = (op1 / parseFloat(op2));
        break;
      case '*':
        this.operac = (op1 * parseFloat(op2));
        break;
    }
    return this.operac;
  }
  sicero(remplazo) {
    if (this.operacion === '0') {
      this.operacion = remplazo;
      return true;
    }
    return false;
  }

  getResultado(): Observable<number> {
    return this.resultado$.asObservable();
  }

  getIgual() {
    let x;
    if (this._ss.length === 0) {
      this.o1 = parseFloat(this.operacion);
      this.operacion = '0';
      this.ss = '+';
      x = this.opera(this.o1, this.operacion, this.ss);
    } else if (this._ss.length === 1) {
      x = this.opera(this.o1, this.operacion, this.ss);
    } else {
      x = this.opera(this.o1, this.operacion, this._ss[(this._ss.length - 1)]);
    }
    this.resultado$.next(x);
    this.mirame$.next('');
    this.ss = '';
    this.signo = false;
    this.o1 = x;
    this.operacion = '0';
    this._ss.length = 0;
  }

  guardarResultadoEnMongoDB(resultado: any): Observable<any> {
    return this.http.post<any>('http://localhost:3800/api/resultados', resultado);
  }

}

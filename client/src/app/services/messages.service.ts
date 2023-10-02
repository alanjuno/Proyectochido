import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Message } from './../models/message';

@Injectable()
export class MessageService {

    public url: string;

    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    // Enviar un mensaje
    sendMessage(token, message: Message): Observable<any> {
        const params = JSON.stringify(message);
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', token);

        return this._http.post(this.url + 'save-message', params, {headers});
    }

    // Listar los mensajes recibidos
    getReceivedMessages(token, page = 1): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', token);

        return this._http.get(this.url + 'received-messages/' + page, {headers});
    }

    // Listar los mensajes enviados
    getSentMessages(token, page = 1): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', token);

        return this._http.get(this.url + 'sent-messages/' + page, {headers});
    }
}

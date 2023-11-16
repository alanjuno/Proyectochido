import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { User } from './../models/user';

@Injectable()
export class UserService {
    public url: string;
    public identity;
    public  token;
    public stats;

    constructor(public _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    // Método para registrar un usuario
    register(user: User): Observable<any> {
        const params = JSON.stringify(user);
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'register', params, {headers});
    }

    // Método para enviar correo de confirmación
    sendConfirmationEmail(emailParams: any): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'envio', emailParams, { headers });
    }

    // Método de login
    signup(user, gettoken = null): Observable<any> {
        if (gettoken !== null) {
            user.gettoken = gettoken;
        }

        const params = JSON.stringify(user);
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'login', params, {headers});
    }

    // Consultar Local Storage para sacar identidad del usuario identificado
    // Convertir el string almacenado en local storage a un objeto JSON
    getIdentity() {
        const identity = JSON.parse(localStorage.getItem('identity'));

        if (identity !== 'undefined') {
            this.identity = identity;
        } else {
            this.identity = null;
        }

        return this.identity;
    }

    // Consultar Local Storage para sacar el token del usuario identificado
    getToken() {
        const token = localStorage.getItem('token');

        if (token !== 'undefined') {
            this.token = token;
        } else {
            this.token = null;
        }

        return this.token;
    }

    // Conseguir información del local storage
    getStats() {
        const stats = JSON.parse(localStorage.getItem('stats'));

        if (stats !== 'undefined') {
            this.stats = stats;
        } else {
            this.stats = null;
        }

        return this.stats;
    }

    // Estadísticas de usuario
    getCounters(userId = null): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', this.getToken());

        if (userId !== null) {
            return this._http.get(this.url + 'counters/' + userId, {headers});
        } else {
            return this._http.get(this.url + 'counters', {headers});
        }
    }

    // Actualizar datos de usuario
    updateUser(user: User): Observable<any> {
        const params = JSON.stringify(user);
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', this.getToken()); // Saca el token del local storage

        return this._http.put(this.url + 'update-user/' + user._id, params, {headers});
    }

    // Listar usuarios
    getUsers(page = null): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', this.getToken()); // Saca el token del local storage

        return this._http.get(this.url + 'users/' + page, {headers});
    }

    // Obtener  un usuario
    getUser(id: string): Observable<any> {
        const params = JSON.stringify(id);
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', this.getToken()); // Saca el token del local storage

        return this._http.get(this.url + 'user/' + id, {headers});
    }
}

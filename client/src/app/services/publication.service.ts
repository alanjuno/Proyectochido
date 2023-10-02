import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Publication } from './../models/publication';
import { GLOBAL } from './global';

@Injectable()
export class PublicationService {

    public url: string;

    constructor(
        private _http: HttpClient
    ) {
        this.url = GLOBAL.url;
    }

    // Crear una Publicación
    addPublication(token, publication: Publication): Observable<any> {
        const params = JSON.stringify(publication);
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', token);

        return this._http.post(this.url + 'save-publication', params, {headers});
    }

    // Listar publicaciones de usuarios que seguimos
    getPublications(token, page = 1): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', token);

        return this._http.get(this.url + 'publications/' + page, {headers});
    }

    // Listar publicaciones de un usuario
    getPublicationsUser(token, userId, page = 1): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', token);

        return this._http.get(this.url + 'publications-user/' + userId + '/' + page, {headers});
    }

    // Eliminar una publicación
    deletePublication(token, id): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', token);

        return this._http.delete(this.url + 'delete-publication/' + id, {headers});
    }
}

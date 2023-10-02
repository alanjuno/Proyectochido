import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Follow } from './../models/follow';
import { GLOBAL } from './global';

@Injectable()
export class FollowService {
    public url: string;

    constructor(
        private _http: HttpClient
    ) {
        this.url = GLOBAL.url;
    }

    // Seguir a un usuario
    addFollow(token, follow: Follow): Observable<any> {
        const params = JSON.stringify(follow);
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', token);

        return this._http.post(this.url + 'save-follow', params, {headers});
    }

    // Dejar de seguir a un usuario
    deleteFollow(token, id): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type',  'application/json')
        .set('Authorization', token);

        return this._http.delete(this.url + 'follow/' + id, {headers});
    }

    getFollowing(token, userId = null, page = 1): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type',  'application/json')
        .set('Authorization', token);

        return this._http.get(this.url + 'following/' + userId + '/' + page, {headers});
    }

    getFollowed(token, userId = null, page = 1): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type',  'application/json')
        .set('Authorization', token);

        return this._http.get(this.url + 'followed/' + userId + '/' + page, {headers});
    }

    getMyFollows(token): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type',  'application/json')
        .set('Authorization', token);

        return this._http.get(this.url + 'get-my-follows/', {headers});
    }
}

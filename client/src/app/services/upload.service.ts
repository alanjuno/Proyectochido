import { Injectable } from '@angular/core';
import { GLOBAL } from './global';

@Injectable()
export class UploadService {
    public url: string;

    constructor() {
        this.url = GLOBAL.url;
    }

    // Método para hacer peticiones AJAX y subir archivos
    makeFileRequest(url: string, params: Array<string>,
                    files: Array<File>, token: string, name: string) {

        return new Promise((resolve, reject) => {
            const formData: any = new FormData();
            const xhr = new XMLHttpRequest(); // Objeto que permite hacer peticiones AJAX

            for (const file of files) {
                formData.append(name, file, file.name);
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            };

            xhr.open('post', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });

    }
}

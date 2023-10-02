import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from './../../models/user';
import { UserService } from './../../services/user.service';
import { UploadService } from './../../services/upload.service';
import { GLOBAL } from './../../services/global';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
  providers: [UserService, UploadService]
})

export class EditUserComponent implements OnInit {

  public title: string;
  public user: User;
  public identity;
  public token;
  public status: string;
  public url: string;
  public filesToUpload;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _uploadService: UploadService
  ) {
    this.title = 'ACTULIZAR MIS DATOS';
    this.user = this._userService.getIdentity(); // usuario identificado
    this.identity = this.user;
    this.token = this._userService.getToken(); // Token usuario identificado
    this.url = GLOBAL.url;
    this.filesToUpload = new Array<File>();
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this._userService.updateUser(this.user).subscribe(
      response => {
        if (!response.user) {
          this.status = 'error';
        } else {
          this.status = 'success';
          localStorage.setItem('identity', JSON.stringify(this.user));
          this.identity = this.user;

          // Subida de imagen de usuario
          if (this.filesToUpload && this.filesToUpload.length) {
            // tslint:disable-next-line: max-line-length
            this._uploadService.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload, this.token, 'image')
            .then((resultado: any) => {
              this.user.image = resultado.user.image;
              localStorage.setItem('identity', JSON.stringify(this.user));
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            this.status = 'success';
          }
        }
      },
      error => {
        const errorMessage = error;
        console.log(errorMessage);
        if (errorMessage !== null) {
          this.status = 'error';
        }
      }
    );
  }

  // Método para subir avatar de usuario
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = fileInput.target.files;
  }

}

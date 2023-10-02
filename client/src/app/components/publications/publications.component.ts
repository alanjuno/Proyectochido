import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from './../../models/publication';
import { UserService } from './../../services/user.service';
import { PublicationService } from './../../services/publication.service';
import { GLOBAL } from './../../services/global';
import * as $ from 'jquery';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css'],
  providers: [UserService, PublicationService]
})
export class PublicationsComponent implements OnInit {

  public title: string;
  public identity;
  public token;
  public url: string;
  public status: string;
  public page;
  public itemsPerPage;
  public total;
  public pages;
  public noMore = false;
  public showImage;
  public publications: Publication[];
  @Input() userId: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService
  ) {
    this.title = 'Publicaciones';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.page = 1;
  }

  ngOnInit(): void {
    this.getPublicationsUser(this.userId, this.page);
  }

  getPublicationsUser(userId, page, adding = false) {
    this._publicationService.getPublicationsUser(this.token, userId, page).subscribe(
      response => {
        if (response.publications) {
          this.status = 'success';
          this.total = response.total;
          this.pages = response.pages;
          this.itemsPerPage = response.itemsPerPage;

          if (!adding) {
            this.publications = response.publications;
          } else {
            const array = this.publications;
            const arrayAdd = response.publications; // El nuevo array que devuelve la API
            this.publications = array.concat(arrayAdd);

            $('html, body').animate({scrollTop: $('html').prop('scrollHeight')} , 800);
          }

          if (page > this.page) {
            this._router.navigate(['/home']);
          }

        } else {
          this.status = 'error';
        }
      },
      error => {
        const errorMessage = error as any;
        console.log(errorMessage);
        if (errorMessage !== null) {
          this.status = 'error';
        }
      }
    );
  }

  // Ver más publicaciones de usuarios que seguimos
  viewMore() {

    this.page += 1;

    if (this.page === this.pages) {
      this.noMore = true;
    }

    this.getPublicationsUser(this.page, true);
  }

   // Refrescar número de publicaciones
   refreshPublications(event = null) {
    this.getPublicationsUser(this.page, true);
  }

  // Mostrar imagen de la publicación
  showImagePublication(id) {
    this.showImage = id;
  }

  // Ocultar imagen de la publicación
  hideImagePublication(id) {
    this.showImage = 0;
  }

    // Eliminar publicación que pertenece a un usuario
    deletePublication(id) {
      this._publicationService.deletePublication(this.token, id).subscribe(
        response => {
          this.refreshPublications();
        },
        error => {
          const errorMessage = error as any;
          console.log(errorMessage);
          if (errorMessage !== null) {
            this.status = 'error';
          }
        }
      );
    }

}

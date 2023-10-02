import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from './../../models/publication';
import { UserService } from './../../services/user.service';
import { PublicationService } from './../../services/publication.service';
import { GLOBAL } from './../../services/global';
import * as $ from 'jquery';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [UserService, PublicationService]
})
export class TimelineComponent implements OnInit {

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
  public publications: Publication[];
  public showImage;

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
    this.getPublications(this.page);
  }

  getPublications(page, adding = false) {
    this._publicationService.getPublications(this.token, page).subscribe(
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

    this.getPublications(this.page, true);
  }

  // Refrescar número de publicaciones
  refreshPublications(event = null) {
    this.getPublications(1);
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
        if (response.status === 200) {
          this.refreshPublications();
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

}

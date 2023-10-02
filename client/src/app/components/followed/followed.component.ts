import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from './../../models/user';
import { Follow } from './../../models/follow';
import { UserService } from './../../services/user.service';
import { FollowService } from './../../services/follow.service';
import { GLOBAL } from './../../services/global';

@Component({
  selector: 'app-followed',
  templateUrl: './followed.component.html',
  styleUrls: ['./followed.component.css'],
  providers: [UserService, FollowService]
})
export class FollowedComponent implements OnInit {

  public title: string;
  public url: string;
  public identity;
  public token;
  public page;
  public total;
  public pages;
  public users: User[];
  public follows;
  public nextPage;
  public previusPage;
  public status: string;
  public followUserOver;
  public followers;
  public userPageId;
  public user: User;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService
  ) {
    this.title = 'Usuarios que siguen a';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    this.actualPage();
  }

  actualPage() {
    this._route.params.subscribe(params => {
      const userId = params[`id`];
      this.userPageId = userId;
      let page = +params[`page`];
      this.page = page;

      if (!params[`page`]) {
        page = 1;
      }

      if (!page) {
        page = 1;
      } else {
        this.nextPage = page + 1;
        this.previusPage = page - 1;

        if (this.previusPage <= 0) {
          this.previusPage = 1;
        }
      }

      // Devolver listado de usuarios
      this.getUser(userId, page);

    });
  }

  getFollows(userId, page) {
    this._followService.getFollowed(this.token, userId, page).subscribe(
      response => {
        // console.log(response);
        if (!response.follows) {
          this.status = 'error';
        } else {
          this.total = response.total;
          this.followers = response.follows;
          this.pages = response.pages;
          this.follows = response.usersFollowing;

          if (page > this.pages) {
            this._router.navigate(['/siguiendo', 1]);
          }
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

  // Mostrar u ocultar botones de siguiendo y dejar de seguir
  mouseEnter(userId) {
    this.followUserOver = userId;
  }

  mouseLeave(userId) {
    this.followUserOver = 0;
  }

  // Seguir a un usuario
  followUser(followed) {
    const follow = new Follow('', this.identity._id, followed);

    this._followService.addFollow(this.token, follow).subscribe(
      response => {
        if (!response.follow) {
          this.status = 'error';
        } else {
          this.status = 'success';
          this.follows.push(followed);
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

  // Dejar de seguir a un usuario
  unfollowUser(followed) {
    this._followService.deleteFollow(this.token, followed).subscribe(
      response => {
        const search = this.follows.indexOf(followed);
        if (search !== -1) {
          this.follows.splice(search, 1); // Eliminar solo el elemento encontrado
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

  getUser(userId, page) {
    this._userService.getUser(userId).subscribe(
      response => {
        if (response.user) {
          this.user = response.user;
          // Devolver listado de usuarios que sigo
          this.getFollows(userId, page);
        } else {
          this._router.navigate(['/home']); // Utlizar componente 404
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

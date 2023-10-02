import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from './../../models/user';
import { Follow } from './../../models/follow';
import { UserService } from './../../services/user.service';
import { FollowService } from './../../services/follow.service';
import { GLOBAL } from './../../services/global';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, FollowService]
})
export class ProfileComponent implements OnInit {

  public title: string;
  public user: User;
  public followed;
  public following;
  public status: string;
  public identity;
  public token;
  public stats;
  public url;
  public followUserOver;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _folloService: FollowService

  ) {
    this.title = 'Perfil de';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.followed = false;
    this.following = false;
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this._route.params.subscribe(params => {
      const id = params[`id`];
      this.getUser(id);
      this.getCounters(id);
    });
  }

  getUser(id) {
    this._userService.getUser(id).subscribe(
      response => {
        if (response.user) {
          this.user = response.user;

          if (response && response.following && response.following._id) {
            this.following = true;
          } else {
            this.following = false;
          }

          if (response && response.followed && response.followed._id) {
            this.followed = true;
          } else {
            this.followed = false;
          }

        } else {
          this.status = 'error';
        }
      },
      error  => {
        const errorMessage = error as any;
        console.log(errorMessage);
        if (errorMessage !== null) {
          this.status = 'error';
          this._router.navigate(['/perfil', this.identity._id]);
        }
      }
    );
  }

  getCounters(id) {
    this._userService.getCounters(id).subscribe(
      response => {
        if (response) {
          this.stats = response;
        } else {
          this.status = 'error';
        }
      },
      error  => {
        const errorMessage = error as any;
        console.log(errorMessage);
        if (errorMessage !== null) {
          this.status = 'error';

        }
      }
    );
  }

  // Seguir a un usuario dentro de su perfil
  followUser(followed) {
    const follow = new Follow('', this.identity._id, followed);
    this._folloService.addFollow(this.token, follow).subscribe(
      response => {
        this.following = true;
      },
      error  => {
        const errorMessage = error as any;
        console.log(errorMessage);
        if (errorMessage !== null) {
          this.status = 'error';

        }
      }
    );
  }

  // Dejar de seguir a un usuario dentro de su perfil
  unfollowUser(followed) {
    this._folloService.deleteFollow(this.token, followed).subscribe(
      response => {
        this.following = false;
      },
      error  => {
        const errorMessage = error as any;
        console.log(errorMessage);
        if (errorMessage !== null) {
          this.status = 'error';

        }
      }
    );
  }

  mouseEnter(userId)  {
    this.followUserOver = userId;
  }

  mouseLeave() {
    this.followUserOver = 0;
  }

}

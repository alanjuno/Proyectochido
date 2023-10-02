import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from './../../models/user';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {

  public title: string;
  public user: User;
  public status: string;
  public identity; // Objeto del usuario identificado
  public token; // Token del usuario identificado

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ) {
    this.title = 'IDENTIFICATE';
    this.user = new User('', '', '', '', '', '', 'ROLE_USER', '');
  }

  ngOnInit(): void {
  }

  onSubmit() {
    // Login usuario y conseguir los datos
    this._userService.signup(this.user).subscribe(
      response => {
        this.identity = response.user;
        if (!this.identity && !this.identity._id) {
          this.status = 'error';
        } else {
          // Persistir datos de usuario en local storage
          localStorage.setItem('identity', JSON.stringify(this.identity));

          // Obtener el token
          this.getToken();
        }
      },
      error  => {
        const errorMessage =  error as any;
        if (errorMessage != null)  {
          this.status = 'error';
        }
      }
    );
  }

  getToken() {
      this._userService.signup(this.user, 'true').subscribe(
        response => {
          this.token = response.token;
          if (this.token.length <= 0) {
            this.status = 'error';
          } else {
            // Persistir token de usuario
            localStorage.setItem('token', JSON.stringify(this.token));

            // Obtener estadísticas de usuario
            this.getCounters();
          }
        },
        error  => {
          const errorMessage =  error as any;
          console.log(errorMessage);
          if (errorMessage != null)  {
            this.status = 'error';
          }
        }
      );
  }

  // Sacar estadísticas de usuario identificado
  getCounters() {
    this._userService.getCounters().subscribe(
      response => {
        localStorage.setItem('stats', JSON.stringify(response));
        this.status = 'success';
        // Redirección a home
        this._router.navigate(['/']);
      },
      error => {
        console.log(error);
      }
    );
  }

}

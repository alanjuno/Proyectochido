import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})

export class AppComponent implements OnInit, DoCheck {
  public title: string;
  public identity;
  public url: string;
  public acceptedTerms: boolean = false; // Variable para rastrear la aceptación de términos

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ){
    this.title = 'LOLO LIVE';
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this.identity = this._userService.getIdentity();
    console.log(this.identity);

    // Verificar si los términos ya fueron aceptados
    if (!this.acceptedTerms) {
      // Redirigir al componente de términos y condiciones si aún no han sido aceptados
      this._router.navigate(['/terms-and-conditions']);
    }
  }

  ngDoCheck(): void {
    this.identity = this._userService.getIdentity();
  }

  // Cerrar sesión (vaciar memoria de local storage)
  logout() {
    localStorage.clear();
    this.identity = null;
    this._router.navigate(['/']);
  }

  // Manejar el evento de aceptación de términos
  onTermsAccepted() {
    this.acceptedTerms = true;
    // Redirigir al componente "home" después de aceptar los términos
    this._router.navigate(['/home']);
  }

  navigateToPrivacyPolicy() {
    this._router.navigate(['/privacy-policy']);
  }
}
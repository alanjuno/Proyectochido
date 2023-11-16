import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from './../../models/user';
import { UserService } from './../../services/user.service';

import { HttpClient } from '@angular/common/http';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import * as Notiflix from 'notiflix';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {

  public title: string;
  public user: User;
  public status: string;

  datos:FormGroup

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,

    private httpclien:HttpClient, 
  ) {
    this.title = 'REGISTRATE';
    this.user = new User('', '', '', '', '', '', 'ROLE_USER', '');

    this.datos = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.email]),
      asunto: new FormControl('', Validators.required),
      mensaje: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        this.validatePassword.bind(this) // Usa la función de validación personalizada
      ]),
    });
  }

  

  validatePassword(control: FormControl) {
    const password = control.value;
  
    // Verifica la longitud mínima de 8 caracteres
    if (password.length < 8) {
      return { invalidLength: true }; // Indica que la contraseña es inválida
    }
  
    // Verifica al menos una mayúscula y una minúscula
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      return { noUpperCaseOrLowerCase: true }; // Indica que la contraseña es inválida
    }
  
    // Verifica al menos un carácter especial (por ejemplo, !@#$%^&*)
    if (!/[!@#$%^&*]/.test(password)) {
      return { noSpecialCharacter: true }; // Indica que la contraseña es inválida
    }

    // Verifica que no haya números consecutivos ni hacia adelante ni hacia atrás
  for (let i = 0; i < password.length - 2; i++) {
    const currentCharCode = password.charCodeAt(i);
    const nextCharCode = password.charCodeAt(i + 1);
    const nextNextCharCode = password.charCodeAt(i + 2);

    if (
      (nextCharCode === currentCharCode + 1 && nextNextCharCode === currentCharCode + 2) ||
      (nextCharCode === currentCharCode - 1 && nextNextCharCode === currentCharCode - 2)
    ) {
      return { consecutiveNumbers: true }; // Indica que la contraseña es inválida
    }
  }

  // Verifica que no haya letras consecutivas
  for (let i = 0; i < password.length - 1; i++) {
    const currentCharCode = password.charCodeAt(i);
    const nextCharCode = password.charCodeAt(i + 1);

    if (nextCharCode === currentCharCode + 1 || nextCharCode === currentCharCode - 1) {
      return { consecutiveLetters: true }; // Indica que la contraseña es inválida
    }
  }

    return null; // La contraseña es válida
  }

  ngOnInit(): void {
  }

  onSubmit(registerForm) {
    this._userService.register(this.user).subscribe(
      response => {
        if (response.user && response.user._id) {
          // Registro exitoso
          this.status = 'success';
          registerForm.reset();

          // Enviar correo de confirmación
          this.sendConfirmationEmail(response.user.email);
        }
      },
      error => {
        this.status = 'error';
      }
    );
  }

  sendConfirmationEmail(email: string) {
    Notiflix.Loading.standard('Cargando..');
    let params = {
      email: email,
      asunto: 'Confirmación de cuenta',
      mensaje: 'Gracias por registrarte en nuestra aplicación. Por favor, haz clic en el siguiente enlace para confirmar tu cuenta.'
    };

    this._userService.sendConfirmationEmail(params).subscribe(
      resp => {
        Notiflix.Loading.remove();
        Notiflix.Notify.success('Correo de confirmación enviado correctamente');
      },
      error => {
        console.error(error);
        Notiflix.Loading.remove();
        Notiflix.Notify.failure('Error al enviar el correo de confirmación');
      }
    );
  }



  enviocorreo(){
    Notiflix.Loading.standard('Cargando..');
    let params ={
      email:this.datos.value.correo,
      asunto:this.datos.value.asunto,
      mensaje:this.datos.value.mensaje
    }
    console.log(params)
    this.httpclien.post('http://localhost:5000/envio',params).subscribe(resp=>{
      console.log(resp)
      Notiflix.Loading.remove();
      Notiflix.Notify.success('Enviado correctamente');
    })
  }



}

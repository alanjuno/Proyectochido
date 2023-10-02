import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Message } from './../../../models/message';
import { Follow } from './../../../models/follow';
import { User } from './../../../models/user';
import { MessageService } from './../../../services/messages.service';
import { FollowService } from './../../../services/follow.service';
import { UserService } from './../../../services/user.service';
import { GLOBAL } from './../../../services/global';

@Component({
  selector: 'app-received',
  templateUrl: './received.component.html',
  styleUrls: ['./received.component.css'],
  providers: [FollowService, MessageService]
})
export class ReceivedComponent implements OnInit {

  public title: string;
  public identity: User;
  public token;
  public url: string;
  public status: string;
  public messages: Message[];
  public pages;
  public total;
  public page;
  public nextPage;
  public previusPage;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _followService: FollowService,
    private _userService: UserService,
    private _messageService: MessageService
  ) {
    this.title = 'Mensajes recibidos';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this.actualPage();
  }

  actualPage() {
    this._route.params.subscribe(params => {
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
      this.getMessages(this.token, page);

    });
  }

  // Listado de mensajes enviados
  getMessages(token, page) {
    this._messageService.getReceivedMessages(this.token, page).subscribe(
      response => {
        console.log(response);
        if (response.messages) {
          this.status = 'success';
          this.messages = response.messages;
          this.total = response.total;
          this.pages = response.pages;
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

}

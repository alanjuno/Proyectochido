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
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css'],
  providers: [FollowService, MessageService]
})
export class SendComponent implements OnInit {

  public title: string;
  public message: Message;
  public identity: User;
  public token;
  public url: string;
  public status: string;
  public follows;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _followService: FollowService,
    private _userService: UserService,
    private _messageService: MessageService
  ) {
    this.title = 'Enviar mensaje';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.message = new Message('', '', false, '', this.identity._id, '');
   }

  ngOnInit(): void {
    this.getMyFollows();
  }

  onSubmit(form) {
    // console.log(this.message);
    this._messageService.sendMessage(this.token, this.message).subscribe(
      response => {
        if (response.message) {
          this.status = 'success';
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

  getMyFollows() {
    this._followService.getMyFollows(this.token).subscribe(
      response =>  {
        // console.log(response);
        this.follows = response.follows;
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

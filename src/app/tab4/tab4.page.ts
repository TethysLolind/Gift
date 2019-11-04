import { Component, OnInit, OnDestroy } from '@angular/core';

import * as shortid from 'shortid';
import { SignlarService } from '../services/signlar.service';
import { MessageDto } from '../Model/messageDto';
import { ToastController } from '@ionic/angular';
import { ChatUserDto } from '../Model/chatUserDto';
import { LoginInfoDto } from '../Model/loginInfoDto';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { BroadcastService } from '../services/broadcast.service';
@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit , OnDestroy {
  constructor(private _storage: Storage,
    private _signalrChanel: SignlarService,
    private _broadcaster: BroadcastService,
    private _http: HttpClient,
    ) {

   }
  messages: Array<MessageDto>;
  currentUser: LoginInfoDto;
  currentInput: string;
  timer: Date;
  users: Array<ChatUserDto>;
  ngOnDestroy(): void {
    this.loginOut();
  }


  async ngOnInit() {
    this.timer = new Date();
    this.currentInput = '';
    this.currentUser = {
      name: 'Bo',
      timestamp: this.timer.getMilliseconds(),
      guid: undefined
    };

    this.currentUser.guid = await this._storage.get('userGuid');
    if (this.currentUser.guid !== null || this.currentUser.guid !== undefined) {
      this.currentUser.guid = shortid.generate();
      this._storage.set('userGuid',  this.currentUser.guid);
    }

    this._broadcaster.msgReceiveBus.subscribe(msg => {
      this.messages.push(msg);
    });

    // this.login();





  }

  // saveMsg(msg: MessageDto) {
  //   const strMsg = JSON.stringify(msg);
  //   this._storage.set(this.currentUser.userGuid, strMsg);

  // }

  // loadMsg(userGuid: string) {
  //   const strMsgArray = this._storage.get(this.currentUser.userGuid, );
  // }


  sendMsg(context: string) {
    const msg: MessageDto = {
      fromGuid: this.currentUser.guid,
      toGuid: 'ss',
      timestamp: Date.now(),
      exchanged: false,
      msgId: shortid.generate(),
      context: context
    };
    this._signalrChanel.sendMsg(msg);
  }

  login() {
    if (this.currentUser.guid !== undefined) {
      this._signalrChanel.loginIn(this.currentUser);
    }

  }

  loginOut() {
    if (this.currentUser.guid !== undefined) {
    this._signalrChanel.loginOut(this.currentUser);
    }
  }

  getUsers() {
    this._http.get(environment.chatApi + '/users').pipe(
      map(res => res as Array<ChatUserDto>),
      tap(res => {
        this.users = res;
      } ),
      catchError(e => {
        console.log(e);
        return new Observable();
      })
    );
  }

}

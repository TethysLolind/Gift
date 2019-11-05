import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import * as shortid from 'shortid';
import {
  SignlarService
} from '../services/signlar.service';
import {
  MessageDto
} from '../Model/messageDto';
import {
  UserInfoDto,
  UserStatus
} from '../Model/userInfoDto';
import {
  HttpClient
} from '@angular/common/http';
import {
  environment
} from 'src/environments/environment.prod';
import {
  map,
  tap,
  catchError,
  mergeMap,
  switchMap,
  withLatestFrom
} from 'rxjs/operators';
import {
  Observable,
  of ,
} from 'rxjs';
import {
  Storage
} from '@ionic/storage';
import {
  BroadcastService
} from '../services/broadcast.service';
@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit, OnDestroy {
  constructor(private _storage: Storage,
    private _signalrChanel: SignlarService,
    private _broadcaster: BroadcastService,
    private _http: HttpClient,
  ) {

  }
  messageEvent: Observable < Array < MessageDto > > ;
  messages: Array < MessageDto > ;
  userEvent: Observable < Array < UserInfoDto >> ;
  users: Array < UserInfoDto > ;

  currentUser: UserInfoDto;
  targetUserGuid: string;
  currentInput: string;

  ngOnDestroy(): void {
    this.loginOut();
  }


  async ngOnInit() {
    this.messages = new Array < MessageDto > ();
    this.currentInput = '';
    this.currentUser = {
      name: 'Bo',
      guid: undefined,
      status: UserStatus.Offline,
      connectionId: undefined,
      loginInTime: 0,
      loginOutTIme: 0
    };

    this.currentUser.guid = await this._storage.get('userGuid');
    if (this.currentUser.guid !== null || this.currentUser.guid !== undefined) {
      this.currentUser.guid = shortid.generate();
      this._storage.set('userGuid', this.currentUser.guid);
    }


    this.messageEvent = this._broadcaster.msgExchangedBus.pipe(
      mergeMap(msg => {
        this.messages.push(msg);
        this.messages.sort((a, b) => {
          return a.timestamp - b.timestamp;
        });
        return of(this.messages);

      })

    );


    this.userEvent = this._broadcaster.userBus.pipe(
      map(users => users)
    );


    // this.login();





  }

  // saveMsg(msg: MessageDto) {
  //   const strMsg = JSON.stringify(msg);
  //   this._storage.set(this.currentUser.userGuid, strMsg);

  // }

  // loadMsg(userGuid: string) {
  //   const strMsgArray = this._storage.get(this.currentUser.userGuid, );
  // }


  sendMsg() {
    const msg: MessageDto = {
      fromGuid: this.currentUser.guid,
      toGuid: this.targetUserGuid,
      timestamp: Date.now(),
      exchanged: false,
      msgId: shortid.generate(),
      context: this.currentInput
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
    this._signalrChanel.getUsers();
  }

}

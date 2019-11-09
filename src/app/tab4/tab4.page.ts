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
  withLatestFrom,
  filter
} from 'rxjs/operators';
import {
  Observable,
  of,
  Subscription,
  interval,
} from 'rxjs';

import {
  BroadcastService
} from '../services/broadcast.service';
import {
  UserManageService
} from '../services/user-manage.service';
@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  constructor(
    public signalrService: SignlarService,
    private _broadcaster: BroadcastService,
    private _http: HttpClient,
    public userService: UserManageService
  ) {

  }
  messageEvent: Observable < Array < MessageDto > > ;
  messages: Array < MessageDto > ;
  userEvent: Observable < Array < UserInfoDto >> ;

  targetUser: UserInfoDto;
  currentInput: string;
  currentUser: UserInfoDto;

  previousUsers: Array < UserInfoDto > ;





  ngOnInit() {

    this.previousUsers = new Array < UserInfoDto > ();
    this.currentInput = '';
    this.currentUser = this.userService.currentUser;
    this.targetUser = this.userService.targetUser;

    this.messages = new Array < MessageDto > ();
    this.messageEvent = this._broadcaster.msgExchangedBus.pipe(
      mergeMap(msg => {
        if (msg.context === environment.clearMsg) {
          this.messages = new Array<MessageDto>();
          return of(new Array<MessageDto>());
        }
        this.messages.push(msg);
        this.messages.sort((a, b) => {
          return a.timestamp - b.timestamp;
        });
        return of(this.messages);

      })

    );
    this.userEvent = this._broadcaster.userBus.pipe(
      filter(users => {
        const previousNameSet = this.previousUsers.map(user => user.name);
        const hasNameDiffer =  users.some(user => !previousNameSet.includes(user.name) );
        return (users.length !== this.previousUsers.length) || hasNameDiffer;
      }),
      tap(users => {
        this.previousUsers = users;
      })

    );



    // this.login();





  }

  clearMsg() {
    const clearMsg: MessageDto = {
      fromGuid: undefined,
    toGuid: undefined,
    timestamp: undefined,
    exchanged: undefined,
    msgId: undefined,
    context: environment.clearMsg
    };
    this._broadcaster.msgExchangedBus.next(clearMsg);
  }

  sendMsg() {
    const msg: MessageDto = {
      fromGuid: this.userService.currentUser.guid,
      toGuid: this.userService.targetUser.guid,
      timestamp: undefined,
      exchanged: false,
      msgId: shortid.generate(),
      context: this.currentInput
    };
    this.signalrService.sendMsg(msg);

  }





}

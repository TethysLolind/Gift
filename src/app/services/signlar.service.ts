import {
  Injectable
} from '@angular/core';
import * as signalR from '@aspnet/signalr';
import {
  environment
} from 'src/environments/environment';
import {
  BroadcastService
} from './broadcast.service';

import {
  MessageDto
} from '../Model/messageDto';
import { UserInfoDto, UserStatus } from '../Model/userInfoDto';
@Injectable({
  providedIn: 'root'
})
export class SignlarService {

  constructor(private _broadcastService: BroadcastService) {
    this._signalrUrl = environment.signalrUrl;
    this._timer = new Date();
  }

  private _timer: Date;
  private _signalrUrl: string;
  private _signalrConnection: signalR.HubConnection;
  retryCount = 0;
  getUsers() {
    this.initSignalr().then(() => {
      this._signalrConnection.invoke('GetOnlineUsers', '');
    }).catch((err) => {
      console.log(err);
    });
  }

  private initSignalr() {
    if (this._signalrConnection === undefined || this._signalrConnection.state !== signalR.HubConnectionState.Connected) {

      this._signalrConnection = new signalR.HubConnectionBuilder()
        .withUrl(this._signalrUrl, {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();
      this._signalrConnection.serverTimeoutInMilliseconds = 1000000;


      this._signalrConnection.on('MessageSendFail', (msg: MessageDto) => {
        this.retryCount++;
        if (this.retryCount <= 3) {
          this.sendMsg(msg);
        }
      });


      this._signalrConnection.on('MessageSendSuccess', (msg: MessageDto) => {
       this._broadcastService.msgExchangedBus.next(msg);
      });
      this._signalrConnection.on('MessageReceive', (msg: MessageDto) => {
        this._broadcastService.msgExchangedBus.next(msg);
        // this._signalrConnection.invoke('ReceivedMsg', this._timer.getMilliseconds) ;
      });

      this._signalrConnection.on('LoginInSuccess', (user: UserInfoDto) => {
        this._broadcastService.toastBus.next('login in success at ' + user.loginInTime);
      });

      this._signalrConnection.on('LoginOutSuccess', (user: UserInfoDto) => {
        this._broadcastService.toastBus.next('login out success at ' + user.loginInTime);
      });

      this._signalrConnection.on('LoginInFail', (user: UserInfoDto) => {
        if (user.status === UserStatus.Online) {
          this._broadcastService.toastBus.next('login in failed,user already existed');
        }
        this._broadcastService.toastBus.next('login in failed ');
      });

      this._signalrConnection.on('LoginOutFail', (user: UserInfoDto) => {
        this._broadcastService.toastBus.next('login out failed' );
      });

      this._signalrConnection.on('OnlineUsers', (users: Array<UserInfoDto>) => {
        this._broadcastService.userBus.next(users );
      });


      return this._signalrConnection.start();
    } else {
      return Promise.resolve();
    }

  }

  public loginIn(dto: UserInfoDto) {
    this.initSignalr().then(() => {
      this._signalrConnection.invoke('loginIn', dto)
      .catch(error => {
        console.error(error.toString());
      });
    });

  }

  public loginOut(dto: UserInfoDto) {
    this.initSignalr().then(() => {
        this._signalrConnection.invoke('loginOut', dto)
        .catch(error => {
          console.error(error.toString());
        });
      });
    }



  public sendMsg(dto: MessageDto) {
    this.initSignalr().then(() => {
      this._signalrConnection.invoke('MessageExchange', dto)
      .catch(error => {
        console.error(error.toString());
      });
    });
  }



}

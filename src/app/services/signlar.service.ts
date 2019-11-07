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
import { UserManageService } from './user-manage.service';
import { interval, Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SignlarService {

  constructor(private _broadcastService: BroadcastService, private _user: UserManageService) {
    this._signalrUrl = environment.signalrUrl;
  }

  private _aliveLoop: Subscription;
  private _signalrUrl: string;
  private _signalrConnection: signalR.HubConnection;
  retryCount = 0;


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
        this._broadcastService.userBus.next(new Array<UserInfoDto>());
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

      this._signalrConnection.on('AliveUpdateFail', (time) => {
        this._broadcastService.toastBus.next('alive user failed' );
      });

      this._signalrConnection.on('AliveUpdateSuccess', (time) => {
        this._broadcastService.toastBus.next('alive user' );
      });


      return this._signalrConnection.start();
    } else {
      return Promise.resolve();
    }

  }

  public loginIn(dto: UserInfoDto) {
    this.initSignalr().then(() => {
      this._signalrConnection.invoke('loginIn', dto).then(() => {
        this.aliveLoop();
      })
      .catch(error => {
        console.error(error.toString());
      });
    });



  }

  public aliveLoop() {
    if ( this._aliveLoop !== undefined) {
      this._aliveLoop.unsubscribe();
    }
    this._aliveLoop = interval(5000).subscribe(() => {
      this.aliveUser(this._user.currentUser);
    });

  }

  public loginOut(dto: UserInfoDto) {
    this.initSignalr().then(() => {
        this._signalrConnection.invoke('loginOut', dto).then(() => {
          this._aliveLoop.unsubscribe();
        })
        .catch(error => {
          console.error(error.toString());
        });
      });
    }

  public aliveUser(dto: UserInfoDto) {
    this.initSignalr().then(() => {
      this._signalrConnection.invoke('alive', dto )
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

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
  LoginInfoDto
} from '../Model/loginInfoDto';
import {
  MessageDto
} from '../Model/messageDto';
@Injectable({
  providedIn: 'root'
})
export class SignlarService {

  private _timer: Date;
  private _signalrUrl: string;
  private _signalrConnection: signalR.HubConnection;
  retryCount = 0;

  constructor(private _broadcastService: BroadcastService) {
    this._signalrUrl = environment.signalrUrl;
    this._timer = new Date();
  }

  private initSignalr() {
    if (this._signalrConnection === undefined || this._signalrConnection.state !== signalR.HubConnectionState.Connected) {

      this._signalrConnection = new signalR.HubConnectionBuilder()
        .withUrl(this._signalrUrl, {
          // skipNegotiation: true,
          // transport: signalR.HttpTransportType.WebSockets,
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

      this._signalrConnection.on('MessageReceive', (msg: MessageDto) => {
        this._broadcastService.msgReceiveBus.next(msg);
        // this._signalrConnection.invoke('ReceivedMsg', this._timer.getMilliseconds) ;
      });

      this._signalrConnection.on('LoginInSuccess', (time: number) => {
        this._broadcastService.toastBus.next('login in success at ' + time);
      });

      this._signalrConnection.on('LoginOutSuccess', (time: number) => {
        this._broadcastService.toastBus.next('login out success at ' + time);
      });

      this._signalrConnection.on('LoginInFail', (time: number) => {
        this._broadcastService.toastBus.next('login in failed at ' + time);
      });

      this._signalrConnection.on('LoginOutFail', (time: number) => {
        this._broadcastService.toastBus.next('login out failed at ' + time);
      });


      return this._signalrConnection.start();
    } else {
      return Promise.resolve();
    }

  }

  public loginIn(dto: LoginInfoDto) {
    this.initSignalr().then(() => {
      this._signalrConnection.invoke('loginIn', dto)
      .catch(error => {
        console.error(error.toString());
      });
    });

  }

  public loginOut(dto: LoginInfoDto) {
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

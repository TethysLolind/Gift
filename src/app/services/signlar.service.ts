import {
  Injectable
} from '@angular/core';
import * as signalR from '@aspnet/signalr';
import {
  environment
} from 'src/environments/environment';
import {
  from
} from 'rxjs';
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

  constructor(private _broadcastService: BroadcastService) {
    this._signalrUrl = environment.signalrUrl;
    this._timer = new Date();
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
      this._signalrConnection.serverTimeoutInMilliseconds = 100000;

      return this._signalrConnection.start();
    } else {
      return Promise.resolve();
    }

  }

  public loginIn(dto: LoginInfoDto) {
    this.initSignalr().then(() => {
      this._signalrConnection.on('RetriveMsg', (msg: MessageDto) => {
        this._broadcastService.msgReceiveBus.next(msg);
        this._signalrConnection.invoke('ReceivedMsg', this._timer.getMilliseconds) ;
      });

      this._signalrConnection.invoke('loginIn', dto)
      .then(res => {this._broadcastService.loginToastBus.next(res); })
      .catch(error => {
        console.error(error.toString());
      });
    });

  }

  public loginOut(dto: LoginInfoDto) {
    this.initSignalr().then(() => {
        this._signalrConnection.invoke('loginOut', dto)
        .then(res => {this._broadcastService.loginToastBus.next(res); })
        .catch(error => {
          console.error(error.toString());
        });
      });
    }



  public sendMsg(dto: MessageDto) {
    this.initSignalr().then(() => {
      this._signalrConnection.invoke('SendMsg', dto)
      .then(() => {
        this._broadcastService.msgSendedBus.next(true);
       })
      .catch(error => {
        this._broadcastService.msgSendedBus.next(false);
        console.error(error.toString());
      });
    });
  }

}

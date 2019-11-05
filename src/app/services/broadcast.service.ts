import { Injectable } from '@angular/core';
import { MessageDto } from '../Model/messageDto';
import { Subject } from 'rxjs';
import { UserInfoDto } from '../Model/userInfoDto';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {
  msgExchangedBus: Subject<MessageDto>;
  toastBus: Subject<string>;
  userBus: Subject<Array<UserInfoDto>>;



constructor() {
  this.msgExchangedBus = new Subject<MessageDto>();


  this.toastBus = new Subject<string>();

  this.userBus = new Subject<Array<UserInfoDto>>();
 }

}

import { Injectable } from '@angular/core';
import { MessageDto } from '../Model/messageDto';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {
  msgSendedBus: Subject<boolean>;
  loginToastBus: Subject<string>;
  msgReceiveBus: Subject<MessageDto>;

constructor() {
  this.msgSendedBus = new Subject<boolean>();
  this.loginToastBus = new Subject<string>();
  this.msgReceiveBus = new Subject<MessageDto>();
 }

}

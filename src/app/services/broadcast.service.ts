import { Injectable } from '@angular/core';
import { MessageDto } from '../Model/messageDto';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {
  msgSendBus: Subject<MessageDto>;
  msgReceiveBus: Subject<MessageDto>;
  toastBus: Subject<string>;


constructor() {
  this.msgSendBus = new Subject<MessageDto>();

  this.msgReceiveBus = new Subject<MessageDto>();

  this.toastBus = new Subject<string>();
 }

}

import { Injectable, OnInit } from '@angular/core';
import { MessageDto } from '../Model/messageDto';
import { Subject } from 'rxjs';
import { UserInfoDto } from '../Model/userInfoDto';
import { ToastOptions } from '@ionic/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService implements OnInit {

  msgExchangedBus: Subject<MessageDto>;
  toastBus: Subject<string>;
  userBus: Subject<Array<UserInfoDto>>;

constructor(private toastControl: ToastController) {
  this.msgExchangedBus = new Subject<MessageDto>();
  this.toastBus = new Subject<string>();
  this.userBus = new Subject<Array<UserInfoDto>>();
 }

  ngOnInit(): void {

    this.monitorChatStatus();
  }

 monitorChatStatus() {
  this.msgExchangedBus.subscribe((msg) => {
    const toastOpt: ToastOptions = {
     // header?: string;
     message: 'a new message from ' + msg.fromGuid,
     // cssClass?: string | string[];
     duration: 2000,
     // buttons?: (ToastButton | string)[];
     // showCloseButton?: boolean;
     // closeButtonText?: string;
     position: 'bottom' ,
     // translucent?: boolean;
     animated: true,
     // color?: Color;
     // mode?: Mode;
     // keyboardClose?: boolean;
     // id?: string;
     // enterAnimation?: AnimationBuilder;
     // leaveAnimation?: AnimationBuilder;
    };
   this.toastControl.create(toastOpt);
  });

  this.toastBus.subscribe((msg) => {
   const toastOpt: ToastOptions = {
    // header?: string;
    message: msg,
    // cssClass?: string | string[];
    duration: 2000,
    // buttons?: (ToastButton | string)[];
    // showCloseButton?: boolean;
    // closeButtonText?: string;
    position: 'bottom' ,
    // translucent?: boolean;
    animated: true,
    // color?: Color;
    // mode?: Mode;
    // keyboardClose?: boolean;
    // id?: string;
    // enterAnimation?: AnimationBuilder;
    // leaveAnimation?: AnimationBuilder;
   };
  this.toastControl.create(toastOpt);
 });
 }

}

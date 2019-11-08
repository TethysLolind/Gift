import { Component } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BroadcastService } from './services/broadcast.service';
import { ToastOptions } from '@ionic/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private toastControl: ToastController,
    private broadcaster: BroadcastService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

  }

  monitorChatStatus() {
    this.broadcaster.msgExchangedBus.subscribe((msg) => {
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

    this.broadcaster.toastBus.subscribe((msg) => {
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

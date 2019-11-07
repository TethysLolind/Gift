import { Component, OnInit, ApplicationRef, OnDestroy } from '@angular/core';
import { SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';
import { AlertController, ToastController } from '@ionic/angular';
import { Subscription, interval, concat } from 'rxjs';
import {first} from 'rxjs/operators';
import { AlertOptions, ToastOptions } from '@ionic/core';
import { Plugins } from '@capacitor/core';
import { BroadcastService } from '../services/broadcast.service';
import { SignlarService } from '../services/signlar.service';
import { UserInfoDto, UserStatus } from '../Model/userInfoDto';

const { Network } = Plugins;
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy {
  status: any;
  currentUser: UserInfoDto;
  constructor(private updateService: SwUpdate,

    private signalrService: SignlarService,
    private alertControl: AlertController,
    private toastControl: ToastController,
    private appRef: ApplicationRef,
    ) {
  }
  subscriptions: Subscription[] = [];

  doNothing;
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.signalrService.loginOut(this.currentUser);
  }
  ngOnInit() {
    this.monitorNetwork();
  }


  async monitorNetwork() {

     Network.addListener('networkStatusChange', (nwStatus) => {
      const toastOpt: ToastOptions = {
        message: 'network changes:' + nwStatus.connectionType,
        duration: 2000,
        position: 'bottom' ,
        animated: true,
       };
      this.toastControl.create(toastOpt);
      if (!nwStatus.connected) {
        this.initUpdater();
      }
    });
    // To stop listening:
    // handler.remove();

    // Get the current network status
    this.status = await Network.getStatus();



  }

  initUpdater() {
    const updateTimer$ = interval(1000 * 60 * 0.5);
    const isAppStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
    const appStableInterval$ = concat(updateTimer$, isAppStable$); // 先interval一下,再检查一下stable


    this.subscriptions.push(this.updateService.available.subscribe(e => this.onUpdateAvailable(e)));
    this.subscriptions.push(this.updateService.available.subscribe(e => this.onUpdateActivated(e)));
    this.subscriptions.push(appStableInterval$.subscribe(() => this.checkForUpdate()));
  }
  onUpdateActivated(e: UpdateAvailableEvent): void {
    throw new Error('Method not implemented.');
  }

  checkForUpdate() {
    if (this.updateService.isEnabled) {
      return this.updateService.checkForUpdate();
    }
  }

  onUpdateAvailable(event: UpdateAvailableEvent) {
    console.log(event);
    let opts: AlertOptions;
    opts = {
      header: 'Update Received',
      // subHeader?: string;
      message: 'Updating is Ready, proceed to update',
      // cssClass?: string | string[];
      // inputs?: AlertInput[];
      buttons: [{
        text: 'Not Now',
        role: 'cancel',
        handler: async () => { await Promise.resolve(); }
      },
      {
        text: 'OK',
        handler: async () => {await this.updateService.activateUpdate(); window.location.reload(); }
      }
    ],
      // backdropDismiss?: boolean;
      translucent: true,
      animated: true,
      // mode?: Mode;
      keyboardClose: true,
      // id?: string;
      // enterAnimation?: AnimationBuilder;
      // leaveAnimation?: AnimationBuilder;
    };
    this.alertControl.create(opts).then(e => e.present());
  }

}

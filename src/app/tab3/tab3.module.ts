import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { BaiduMapModule } from 'angular2-baidu-map';
import {Geolocation} from '@ionic-native/geolocation/ngx';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }]),
    BaiduMapModule.forRoot({ ak: '9oP8X52Zu4kZlr5bAru3sNOkQevsGHu8' }),
  ],
  declarations: [Tab3Page],
  providers: [Geolocation]
})
export class Tab3PageModule {}

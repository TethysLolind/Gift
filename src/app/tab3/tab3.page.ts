import {
  Component,
  OnInit
} from '@angular/core';
import {
  Observable
} from 'rxjs';
import {
  Network
} from '@ngx-pwa/offline';
import {
  MapOptions
} from 'angular2-baidu-map';
// import {
//   Geolocation
// } from '@ionic-native/geolocation/ngx';
import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  public opts: MapOptions;
  $hasNetwork: Observable < boolean > ;
  constructor(
    private networkService: Network,
   ) {
    this.opts = {
      centerAndZoom: {
        lng: 121.506191,
        lat: 31.245554,
        zoom: 15
      }
    };
  }
  async getLocation() {
    const loc = await Plugins.Geolocation.getCurrentPosition();
    this.opts = {
      centerAndZoom: {
        lng: loc.coords.longitude,
        lat: loc.coords.latitude,
        zoom: 15
      }
    };

      console.log(this.opts);

  }
  ngOnInit() {
    this.$hasNetwork = this.networkService.onlineChanges;
    Plugins.Geolocation.getCurrentPosition().then(loc => {
      this.opts = {
        centerAndZoom: {
          lng: loc.coords.longitude,
          lat: loc.coords.latitude,
          zoom: 15
        }
      };
    }).catch(error => {
      console.log(error);
    });
    this.$hasNetwork.subscribe();

  }
}

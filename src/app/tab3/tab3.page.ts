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
import {
  Geolocation
} from '@ionic-native/geolocation/ngx';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  public opts: MapOptions;

  $hasNetwork: Observable < boolean > ;
  constructor(private networkService: Network,
    private _geolocation: Geolocation) {
    this.opts = {
      centerAndZoom: {
        lng: 121.506191,
        lat: 31.245554,
        zoom: 15
      }
    };
  }
  getLocation() {
    this._geolocation.getCurrentPosition().then(loc => {
      this.opts = {
        centerAndZoom: {
          lng: loc.coords.longitude,
          lat: loc.coords.latitude,
          zoom: 15
        }

      };
      console.log(this.opts);
    });
  }
  ngOnInit() {
    this.$hasNetwork = this.networkService.onlineChanges;
    this._geolocation.getCurrentPosition().then(loc => {
      this.opts = {
        centerAndZoom: {
          lng: loc.coords.longitude,
          lat: loc.coords.latitude,
          zoom: 15
        }
      };
      console.log(this.opts);
    }).catch(error => {
      console.log(error);
      this.opts = {
        centerAndZoom: {
          lng: 121.506191,
          lat: 31.245554,
          zoom: 15
        }
      };
    });


  }
}

import {
  Component,
  OnInit
} from '@angular/core';
import {
  MapOptions,
  ControlAnchor,
  NavigationControlType,
  MapTypeControlType,
  BaiduMapModule
} from 'angular2-baidu-map';

import {
  BMapInstance,
  Point,
  MarkerOptions,
  NavigationControlOptions,
  OverviewMapControlOptions,
  ScaleControlOptions,
  MapTypeControlOptions
} from 'angular2-baidu-map';

import {
  Plugins
} from '@capacitor/core';
import {
  SignlarService
} from '../services/signlar.service';
import {
  BroadcastService
} from '../services/broadcast.service';
import { from, Observable, interval, of } from 'rxjs';
import { GeoLocationDto } from '../Model/geoLocationDto';
import { map, mergeMap, combineLatest, filter, catchError } from 'rxjs/operators';
import { UserManageService } from '../services/user-manage.service';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  public opts: MapOptions;
  private selfLocationUpdateSignalr: Observable<GeoLocationDto>;
  samoleOpts = {
    enableAutoResize: true,
    enableMapClick: true,
    // disableDragging?: boolean;
    enableScrollWheelZoom: true,
    centerAndZoom: {
      lng: 90.0000,
      lat: 30.0000,
      zoom: 3
    }
  };
  public markers = [{
      options: {
        icon: {
          imageUrl: '/assets/icon/location.png',
          size: {
            height: 15,
            width: 15
          }
        },
        title: 'selfPoint'
      },
      point: {
        lng: 100, // 经度
        lat: 0, // 纬度
      }
    },

  ];
  // 这是控件control
  public controlOpts: NavigationControlOptions = { // 导航控件
    anchor: ControlAnchor.BMAP_ANCHOR_TOP_LEFT, // 显示的控件的位置
    type: NavigationControlType.BMAP_NAVIGATION_CONTROL_LARGE, // 用来描述它是什么样的导航
    offset: { // 控件的大小
      width: 30,
      height: 30
    },
    showZoomInfo: true, // 是否展示当前的信息
    enableGeolocation: true // 是否启用地理定位功能
  };
  public overviewmapOpts: OverviewMapControlOptions = { // 地图全景控件
    anchor: ControlAnchor.BMAP_ANCHOR_BOTTOM_RIGHT, // 显示的控件的位置
    isOpen: true
  };
  public scaleOpts: ScaleControlOptions = { // 比例尺控件
    anchor: ControlAnchor.BMAP_ANCHOR_BOTTOM_LEFT
  };
  public mapTypeOpts: MapTypeControlOptions = { // 地图类型
    type: MapTypeControlType.BMAP_MAPTYPE_CONTROL_HORIZONTAL
  };

  // Geolocation 和Panorama 没有属性

  constructor(private _signlarService: SignlarService,
    private _broadcast: BroadcastService,
     private _user: UserManageService) {

  }


  ngOnInit() {
    this.opts = this.samoleOpts;
    this.getLocation();


    this.selfLocationUpdateSignalr =  interval(4000).pipe(
      mergeMap(e => {
        return from(Plugins.Geolocation.getCurrentPosition()).pipe(
          map(locOpts => {
            const selfLocation: GeoLocationDto = {
              guid:  this._user.currentUser.guid ,
              name:   this._user.currentUser.name,
              lat: locOpts.coords.latitude ,
              lon:  locOpts.coords.longitude ,
              height: 10,
              timestamp: locOpts.timestamp
            };
            return selfLocation;
          }),

          catchError(err => {
            console.log('give default locartion due to:' + err);
            const selfLocation: GeoLocationDto = {
              guid:  this._user.currentUser.guid ,
              name:   this._user.currentUser.name,
              lat: 116,
              lon: 39,
              height: undefined,
              timestamp: undefined
            };
            return of(selfLocation);
          })

        );
      })
    );

    this.selfLocationUpdateSignalr.subscribe(loc => {
      this._signlarService.updateLocation(loc);
    });

    this._broadcast.locationBus.
    pipe(
      filter(locs => locs !== undefined),
    //   combineLatest(this.selfLocationUpdateSignalr),
    //   map(([locs, selfloc]) => {
    //     return [...locs, selfloc];
    //   })
    ).
    subscribe(locs => {
      const ctlocs = locs.filter(loc => loc.guid === this._user.targetUser.guid || loc.guid === this._user.currentUser.guid);
      const receiveMarkers = [];
      ctlocs.forEach(loc => {
          const marker = {
            options: {
              icon: {
                imageUrl: '/assets/icon/location.png',
                size: {
                  height: 15,
                  width: 15
                }
              },
              title: 'SelfPoint'
            },
            point: {
              lng: loc.lon, // 经度
              lat: loc.lat // 纬度
            }
          };
          receiveMarkers.push(marker);
        }
      );
        this.markers = receiveMarkers;
    });

  }

  getLocation() {
    Plugins.Geolocation.getCurrentPosition().then(
      loc => {
        this.opts = {
          enableAutoResize: true,
          enableMapClick: true,
          // disableDragging?: boolean;
          enableScrollWheelZoom: true,
          centerAndZoom: {
            lng: loc.coords.longitude,
            lat: loc.coords.latitude,
            zoom: 15
          }
        };
      }
    );


  }

  updateSelfLocation() {


  }

}

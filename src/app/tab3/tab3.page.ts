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
  BMapInstance,  Point, MarkerOptions, NavigationControlOptions,
   OverviewMapControlOptions, ScaleControlOptions, MapTypeControlOptions
} from 'angular2-baidu-map';
// import {
//   Geolocation
// } from '@ionic-native/geolocation/ngx';
import {
  Plugins
} from '@capacitor/core';
import { setInterval } from 'timers';
import { SignlarService } from '../services/signlar.service';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  public opts: MapOptions;
  samoleOpts = {
    enableAutoResize: true,
    enableMapClick: true,
    // disableDragging?: boolean;
    enableScrollWheelZoom: true,
    centerAndZoom: {
      lng: 128.0000,
      lat: 30.0000,
      zoom: 15
    }
  };
  public markers = [
    {
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


  constructor(private _signlarService: SignlarService) {
    this.opts = this.samoleOpts;
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

  resetSelfLocation() {
    Plugins.Geolocation.getCurrentPosition().then(
      loc => {

        this.markers = [
          {
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
              lng: loc.coords.longitude, // 经度
              lat: loc.coords.latitude, // 纬度
            }
          },

        ];

      }
    );


    console.log(this.markers[0]);
  }
  ngOnInit() {
    this.getLocation();
    setInterval(() => {
      this.resetSelfLocation();
    }, 5000);


  }
}

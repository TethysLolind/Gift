import { Injectable, OnInit } from '@angular/core';
import { MessageDto } from '../Model/messageDto';
import { Subject, BehaviorSubject } from 'rxjs';
import { UserInfoDto } from '../Model/userInfoDto';
import { GeoLocationDto } from '../Model/geoLocationDto';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService implements OnInit {
  msgExchangedBus: Subject<MessageDto>;
  toastBus: Subject<string>;
  userBus: Subject<Array<UserInfoDto>>;
  locationBus: BehaviorSubject<Array<GeoLocationDto>>;
constructor() {
  this.msgExchangedBus = new Subject<MessageDto>();
  this.toastBus = new Subject<string>();
  this.userBus = new Subject<Array<UserInfoDto>>();
  this.locationBus = new BehaviorSubject<Array<GeoLocationDto>>(undefined);
 }

  ngOnInit(): void {


  }



}

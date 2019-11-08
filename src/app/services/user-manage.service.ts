import {
  Injectable, OnInit
} from '@angular/core';
import {
  UserInfoDto,
  UserStatus
} from '../Model/userInfoDto';
import {
  BroadcastService
} from './broadcast.service';
import * as shortid from 'shortid';
import { GeoLocationDto } from '../Model/geoLocationDto';
@Injectable({
  providedIn: 'root'
})
export class UserManageService implements OnInit {


  constructor(private broadcaster: BroadcastService,
 ) {
  this.initCurrentUser();
 }
  public currentUser:  UserInfoDto;
  public targetUser: UserInfoDto;

  ngOnInit(): void {
    this.initCurrentUser();
  }

  public  initCurrentUser() {
    this.currentUser = {
      name: 'Bo',
      guid: shortid.generate(),
      status: UserStatus.Offline,
      connectionId: undefined,
      loginInTime: 0,
      loginOutTime: 0,
      latestTimestamp: undefined
    };



  }


  public setCurrentUserName(name: string) {
    this.currentUser.name = name;
  }

  public setTargetUser(user: UserInfoDto) {
    this.targetUser = user;
  }



}

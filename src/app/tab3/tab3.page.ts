import { Component , OnInit} from '@angular/core';
import { Observable } from 'rxjs';
import {Network} from '@ngx-pwa/offline';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  $hasNetwork: Observable<boolean>;
  constructor(private networkService: Network) {

  }
  ngOnInit() {
    this.$hasNetwork = this.networkService.onlineChanges;
  }
}

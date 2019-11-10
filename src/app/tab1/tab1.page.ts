import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public id1 = '01';
  public id2 = '01';

  public id3 = '01';
  public id4 = '01';
  constructor() {
   this.id1 = this.generatePicId();
   this.id2 = this.generatePicId();
   this.id3 = this.generatePicId();
   this.id4 = this.generatePicId();
  }

  private generatePicId() {
    const idnumber = Math.round(Math.random() * 34);
    let idstring = idnumber.toString();
    if (idnumber < 10) {
      idstring = '0' + idnumber;
    }
    return idstring;
  }
}

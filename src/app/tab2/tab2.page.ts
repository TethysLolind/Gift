import {
  Component,
  OnInit
} from '@angular/core';
import {
  PhotoService, Photo
} from '../services/photo.service';
import { URL } from 'url';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  currentImage: any;

  imagesBlob: Array<Blob>;
  constructor(public photoService: PhotoService) {}

  async ngOnInit() {
    // this.photoService.loadSaved();
    this.imagesBlob = await Promise.all( this.photoService.getImages());
    const photos = this.imagesBlob.map(blob => {
      const photo: Photo = {
        data: webkitURL.createObjectURL(blob),
        text: 'S',
      };
      return photo;
    });
    this.photoService.photos = photos;
    console.log(this.photoService.photos.length);






  }
}

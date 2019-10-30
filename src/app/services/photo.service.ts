import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

import { Plugins, CameraResultType } from '@capacitor/core';

const { Camera } = Plugins;




@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: Photo[] = [];

  constructor( private storage: Storage) { }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    const imageUrl = image.webPath;
    // Can be set to the src of an image now
    this.photos.unshift({
      data: 'data:image/jpeg;base64,' + image.base64String
    });

    // Save all photos for later viewing
    this.storage.set('photos', this.photos);
  }

  loadSaved() {
    this.storage.get('photos').then((photos) => {
      this.photos = photos || [];
    });
  }

}

class Photo {
  data: any;
}

import {
  Injectable
} from '@angular/core';

import {
  Storage
} from '@ionic/storage';

import {
  Plugins,
  CameraResultType
} from '@capacitor/core';
import {
  HttpClient
} from '@angular/common/http';
import {
  map
} from 'rxjs/operators';

const {
  Camera
} = Plugins;




@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: Photo[] = [];

  constructor(private storage: Storage, private http: HttpClient) {}

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64
    });
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    const imageUrl = image.webPath;
    // Can be set to the src of an image now
    const newPhoto: Photo = {
      data: 'data:image/jpeg;base64,' + image.base64String,
      text: imageUrl
    };
    this.photos.unshift(newPhoto);

    const previousPhotos = await this.loadSaved();
    // Save all photos for later viewing
    this.storage.set('photos', [...previousPhotos, newPhoto]);
  }

  async loadSaved() {
    return <Array<Photo>>await this.storage.get('photos');
  }


  getImages() {
    const promiseArray = new Array < Promise < Blob >> ();
    // const imageBlobs = new Array<Blob>();
    for (let index = 0; index < 32; index++) {
      let fileName: string;
      if (index < 9) {
        fileName = '0' + (index + 1);
      } else {
        fileName = (index + 1).toString();
      }
      const promise = this.http.get('/assets/image/' + fileName + '.jpg', {
        responseType: 'blob'
      }).pipe(
        map(res => {
          if (index === 1) {
            console.log(res);
          }
          const blob = new Blob([res], {
            type: 'image/jpg'
          });
          return blob;
        }),
      ).toPromise();
      promiseArray.push(promise);

    }

    return promiseArray;



  }

}

export class Photo {
  data: any;
  text: string;
}
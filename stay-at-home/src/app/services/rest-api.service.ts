import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constants';
import { SimpleCoordinates } from '../simple-coordinates';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  constructor(
    private http: HttpClient
  ) { }

  get(url: string) {
    return this.http.get(Constants.SERVER + '/' + url);
  }

  uploadImage(id: string, base64Image: string) {
    var body = this.formData('image', base64Image);
    return this.http.post(Constants.SERVER + Constants.SERVER_IMAGE_URL + '?id=' + id, body);
  }

  postLocation(coords: SimpleCoordinates) {
    return this.http.post(Constants.ELASTIC_SERVER_POST_URL, coords);
  }

  private blobFromDataURI(dataURI: string) {
    var raw = atob(dataURI.replace(/[^,]+,/, '')),
      imgBuffer = [];
    for (var i = 0, len = raw.length; i < len; i++) {
      imgBuffer.push(raw.charCodeAt(i));
    }
    return new Blob([new Uint8Array(imgBuffer)], { type: 'image/jpeg' });
  }

  private formData(name: string, dataURI: string) {
    var fd = new FormData();
    fd.append(name, this.blobFromDataURI(dataURI));
    return fd;
  }
}
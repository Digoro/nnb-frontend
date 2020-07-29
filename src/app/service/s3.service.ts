import { Injectable } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class S3Service {
  private ACCESS_KEY_ID = environment.ACCESS_KEY_ID;
  private SECREATE_ACCESS_KEY = environment.SECREATE_ACCESS_KEY;
  private REGION = environment.REGION;
  private BUCKET = environment.BUCKET;
  private FOLDER = environment.FOLDER;

  constructor() { }

  uploadFile(file): Promise<any> {
    const contentType = file.type;
    const bucket = new S3(
      {
        accessKeyId: this.ACCESS_KEY_ID,
        secretAccessKey: this.SECREATE_ACCESS_KEY,
        region: this.REGION
      }
    );
    const params = {
      Bucket: this.BUCKET,
      Key: `${this.FOLDER}/${file.name}`,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };
    return new Promise((resolve, reject) => {
      bucket.upload(params, function (err, data) {
        if (err) {
          console.log('There was an error uploading your file: ', err);
          reject(err)
        }
        console.log('Successfully uploaded file.', data);
        resolve(data)
      });
    })
  }
}

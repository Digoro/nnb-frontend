import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import * as S3 from 'aws-sdk/clients/s3';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class S3Service {
  private ACCESS_KEY_ID = environment.ACCESS_KEY_ID;
  private SECREATE_ACCESS_KEY = environment.SECREATE_ACCESS_KEY;
  private REGION = environment.REGION;
  private BUCKET = environment.BUCKET;

  constructor(
    private http: HttpClient
  ) { }

  uploadFile(file, folder: string, metadata?: S3.Metadata): Promise<any> {
    const contentType = file.type;
    const bucket = new S3(
      {
        accessKeyId: this.ACCESS_KEY_ID,
        secretAccessKey: this.SECREATE_ACCESS_KEY,
        region: this.REGION
      }
    );
    const params: S3.Types.PutObjectRequest = {
      Bucket: this.BUCKET,
      Key: `${folder}/${file.name}`,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };
    if (metadata) params.Metadata = metadata;
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

  async getS3ObjectHead(s3: AWS.S3, filename) {
    const params = {
      Bucket: this.BUCKET,
      Key: filename,
    };
    const metadata = await s3.headObject(params).promise();
    return metadata.Metadata['link'];
  }

  getList(prefix: string): Observable<{ image: string, metadata: S3.Metadata }[]> {
    const s3 = new AWS.S3();
    s3.config.credentials = new AWS.Credentials({
      accessKeyId: this.ACCESS_KEY_ID,
      secretAccessKey: this.SECREATE_ACCESS_KEY
    });
    const params = {
      Bucket: this.BUCKET,
      Prefix: prefix
    };
    return new Observable(observer => {
      s3.listObjects(params, (err, data) => {
        const list = data.Contents.filter(file => file.Size != 0).sort((a, b) => {
          if (moment(a.LastModified).isBefore(b.LastModified)) return -1;
          else return 1;
        }).map(file => {
          const params = {
            Bucket: this.BUCKET,
            Key: file.Key,
          };
          const metadata = s3.headObject(params).promise();
          return {
            image: `http://${this.BUCKET}.s3.ap-northeast-2.amazonaws.com/${file.Key}`,
            metadata: metadata
          }
        })
        Promise.all(list.map(el => el.metadata)).then(resp => {
          const output = list.map((el, i) => {
            return {
              image: el.image,
              metadata: resp[i].Metadata
            }
          })
          observer.next(output)
          observer.complete();
        })
      })
    })
  }

  deleteFile(link: string, folder: string): Promise<boolean> {
    const key = `${folder}${link.split(folder)[1]}`
    const s3 = new AWS.S3();
    s3.config.credentials = new AWS.Credentials({
      accessKeyId: this.ACCESS_KEY_ID,
      secretAccessKey: this.SECREATE_ACCESS_KEY
    });
    const params = {
      Bucket: this.BUCKET,
      Key: key
    };
    return new Promise((resolve, reject) => {
      s3.deleteObject(params, (err, data) => {
        if (err) reject(err);
        resolve(true);
      })
    })
  }

  // key: meetings/test.png
  resizeImage(key: string) {
    const url = "https://w39lkl7tk1.execute-api.ap-northeast-2.amazonaws.com/v2/image-resize";
    return this.http.post(url, { key })
  }
}

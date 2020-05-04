import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor() { }


  async uploadFile(file, name) {
    const contentType = file.type;
    const bucket = new S3(
      {
        accessKeyId: 'AKIA4SUPHCAO34OKTYP2',
        secretAccessKey: '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',
        region: 'us-east-2'
      }
    );
    const params = {
      Bucket: 'playlisttest8295/playlistImages',
      Key: name,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };
    // tslint:disable-next-line: only-arrow-functions
    await bucket.upload(params, async function (err, data) {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      console.log('Successfully uploaded file.', data);
      return true;
    }).promise();
  }
}
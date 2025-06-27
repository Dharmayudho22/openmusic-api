const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const config = require('../utils/config');
const { nanoid } = require('nanoid');

class StorageService {
  constructor() {
    this._s3 = new S3Client({
      region: config.aws.region,
      credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
      },
    });
  }

  async writeFile(file, meta) {
    const filename = nanoid(16);
    const Key = `${filename}${meta.filename.substring(meta.filename.lastIndexOf('.'))}`; // Keep original extension

    const command = new PutObjectCommand({
      Bucket: config.aws.bucketName,
      Key,
      Body: file,
      ContentType: meta.headers['content-type'],
    });

    await this._s3.send(command);

    return `http://${config.aws.bucketName}.s3.${config.aws.region}.amazonaws.com/${Key}`;
  }
}

module.exports = StorageService;
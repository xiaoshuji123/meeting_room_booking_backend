import * as crypto from 'crypto';
import { diskStorage } from 'multer';

export function md5(str: string) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

export function randomString(length: number) {
  return crypto.randomBytes(length).toString('hex');
}

export function uploadFileStorage() {
  return diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const filename = `${randomString(16)}.${file.mimetype.split('/')[1]}`;
      cb(null, filename);
    },
  });
}

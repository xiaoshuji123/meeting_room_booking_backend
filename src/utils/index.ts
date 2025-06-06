import * as crypto from 'crypto';

export function md5(str: string) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

export function randomString(length: number) {
  return crypto.randomBytes(length).toString('hex');
}

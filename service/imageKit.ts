import ImageKit from 'imagekit';
import { IMAGEKIT_PRIVATE_KEY, IMAGEKIT_PUBLIC_KEY, IMAGEKIT_URL } from '../env';

export const imageKit = new ImageKit({
  privateKey: IMAGEKIT_PRIVATE_KEY,
  publicKey: IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: IMAGEKIT_URL,
});

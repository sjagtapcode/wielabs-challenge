import fs from 'fs-extra';
import tar from 'tar-stream';
import zlib from 'zlib';
import { logger } from './logger';

// unzip a compressed file using stream and extract the data to desired location
/*
 * filePath: path of the compressed file
 * extractTo: path of the folder to extract the zipped content
 */
export const unzip = async (filePath: string, extractTo: string) => {
  try {
    const readStream = fs.createReadStream(filePath).pipe(zlib.createGunzip());
    const extract = tar.extract();
    await fs.ensureDir(extractTo);
    if (filePath?.slice(filePath?.length - 7, filePath?.length) !== '.tar.gz') {
      logger('Downloaded File is not in proper format');
      return false;
    }
    const filesArray = filePath?.split('/');
    const fileNameWithExtension = filesArray[filesArray?.length - 1];
    const fileName = fileNameWithExtension?.slice(
      0,
      fileNameWithExtension?.length - 7,
    );
    await fs.ensureDir(`${extractTo}/${fileName}`);

    extract.on('entry', async (header, stream, next) => {
      const filePath = `${extractTo}/${header.name}`;
      const writeStream = fs.createWriteStream(filePath);
      stream.pipe(writeStream);
      stream.on('end', () => next());
      stream.on('error', (e) => next(e));
    });

    await new Promise((resolve, reject) => {
      extract.on('finish', resolve);
      extract.on('error', reject);
      readStream.pipe(extract);
    });

    logger(`File extracted to ${extractTo}`);
    return true;
  } catch (err) {
    logger(err);
    return false;
  }
};

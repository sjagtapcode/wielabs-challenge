import fs from 'fs-extra';
import axios from 'axios';
import { logger } from './logger.js';

// downloder = downloads any file from external link and stores at given location in file system
/*
 * url: external file path
 * folder: path to download the file
 * name: downloaded file name
*/
export const downloader = async (url: string, folder: string, tempFileName: string) => {
  try {
    const tempFilePath = `${folder}/${tempFileName}`
    const fileExist = await fs.exists(tempFilePath)
    if (fileExist) { // if file already exists do not download it
      logger(`File Already exists at ${tempFilePath}`);
      return true;
    }
    await fs.ensureDir(folder);

    // Download the tar.gz file
    const response = await axios.get(url, { responseType: 'stream' });
    const writeStream = fs.createWriteStream(tempFilePath);
    response.data.pipe(writeStream);
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
    logger(`File downloaded successfully at ${tempFilePath}`);
    return true;
  } catch (err) {
    logger(err)
    return false;
  }
}

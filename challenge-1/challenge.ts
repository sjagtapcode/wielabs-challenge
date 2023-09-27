import { logger } from './helpers/logger.js';
import { downloader } from './helpers/downloader.js';

const url = 'https://wielabs-task.s3.ap-south-1.amazonaws.com/dump.tar.gz';
const tempDirPath = './tmp';
const tempFileName = 'dump.tar.gz';
const extractedDir = './tmp/extracted';

export async function processDataDump() {
  logger('Processing Data Dump');
  try {
    const isFilePresent = await downloader(url, tempDirPath, tempFileName)
    if(!isFilePresent) {
      logger('Downloading failed!')
      return;
    }

  } catch (err) {
    logger(err);
  }
}

import { logger } from './helpers/logger';
import { downloader } from './helpers/downloader';
import { unzip } from './helpers/unzip';

const url = 'https://wielabs-task.s3.ap-south-1.amazonaws.com/dump.tar.gz';
const tempDirPath = './tmp';
const tempFileName = 'dump.tar.gz';
const tempFilePath = `${tempDirPath}/${tempFileName}`;
const extractedDir = './tmp';

export async function processDataDump() {
  logger('Processing Data Dump');
  try {
    const isFilePresent = await downloader(url, tempDirPath, tempFileName);
    if (!isFilePresent) {
      logger('Downloading failed!');
      return;
    }

    const isFileUnzipped = await unzip(tempFilePath, extractedDir);
    if (!isFileUnzipped) {
      logger('Unzipping failed');
      return;
    }
  } catch (err) {
    logger(err);
  }
}

import { logger } from './helpers/logger';
import { downloader } from './helpers/downloader';
import { unzip } from './helpers/unzip';
import { dbMigration } from './helpers/db';
import { seed } from './helpers/seed';

const url = 'https://wielabs-task.s3.ap-south-1.amazonaws.com/dump.tar.gz';
const tempDirPath = './tmp';
const tempFileName = 'dump.tar.gz';
const tempFilePath = `${tempDirPath}/${tempFileName}`;
const extractedDir = './tmp';
const organizationsCsvFilePath = './tmp/dump/organizations.csv';
const customersCsvFilePath = './tmp/dump/customers.csv';

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

    const isDBConnected = await dbMigration();
    if (!isDBConnected) {
      logger('DB Migration Failed');
      return;
    }

    const isSeedingComplete = await seed(customersCsvFilePath, organizationsCsvFilePath);
    if (!isSeedingComplete) {
      logger('Data Seeding Failed');
      return;
    }
  } catch (err) {
    logger(err);
  }
}

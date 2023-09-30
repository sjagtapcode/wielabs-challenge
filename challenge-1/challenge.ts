import { logger } from './helpers/logger';
import { downloader } from './helpers/downloader';
import { unzip } from './helpers/unzip';
import { dbMigration } from './helpers/db';
import { seed } from './helpers/seed';
import { zipUrl, tempDirPath, tempFileName, tempFilePath, extractedDir, organizationsCsvFilePath, TABLES, customersCsvFilePath } from './constants';

export async function processDataDump() {
  logger('Processing Data Dump');
  try {
    const isFilePresent = await downloader(zipUrl, tempDirPath, tempFileName);
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

    const isCustomersSeedingComplete = await seed(customersCsvFilePath, TABLES.CUSTOMERS);
    if (!isCustomersSeedingComplete) {
      logger('Customers Data Seeding Failed');
    }

    const isOrganizationSeedingComplete = await seed(organizationsCsvFilePath, TABLES.ORGANIZATIONS);
    if (!isOrganizationSeedingComplete) {
      logger('Organization Data Seeding Failed');
    }
  } catch (err) {
    logger(err);
  }
}

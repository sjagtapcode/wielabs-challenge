import knex from 'knex';
import fs from 'fs-extra';
import { developmentConfig } from './db';
import { logger } from './logger';
import * as csv from 'fast-csv';
import { BATCH_SIZE, IRowData, TABLES } from '../constants';

export const seed = async (csvFilePath: string, tableName: TABLES) => {
  const db = knex(developmentConfig);
  try {
    logger('Database connected Successfully!');
    const fileStream = fs.createReadStream(csvFilePath);
    const csvStream = csv.parseStream(fileStream, {
      headers: true,
    });
    let rows: IRowData<typeof tableName>[] = [];
    let batch = 1;
    await new Promise((resolve, reject) => {
      csvStream.on('data', async function (row) {
        try {
          rows.push(row);
          if (rows.length === BATCH_SIZE) {
            await db(tableName).insert(rows);
            logger(`Batch number ${batch} Completed`);
            rows = [];
          }
        } catch (err) {
          logger(err);
          reject(0);
          csvStream.destroy();
        }
      });
      csvStream.on('end', (rowCount: number) => {
        logger(`${rowCount}+ ${tableName} added to the database`);
        resolve(1);
        csvStream.destroy();
      });
      csvStream.on('error', (err) => {
        logger(
          `Something went wrong while adding ${tableName} data to the database`,
        );
        logger(err);
        reject(0);
        csvStream.destroy();
      });
    });
    logger('Seed Complete!');

    return true;
  } catch (err) {
    logger(err);
    return false;
  } finally {
    db.destroy();
  }
};

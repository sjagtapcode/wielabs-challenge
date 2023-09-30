import knex from "knex";
import fs from 'fs-extra';
import { developmentConfig } from "./db";
import { logger } from "./logger";
import Papa from "papaparse";

const BATCH_SIZE = 100;

interface ICustomer {
  'Index': number,
  'Customer Id' : string,
  'First Name': string,
  'Last Name': string,
  'Company': string,
  'City': string,
  'Phone 1': string,
  'Phone 2': string,
  'Email': string,
  'Subscription Date': Date,
  'Website': string,
}
const parser = Papa.parse(Papa.NODE_STREAM_INPUT, {
  header: true,
})

export const seed = async (customersCsvFilePath: string, organizationsCsvFilePath: string) => {
  const db = knex(developmentConfig);
  try {
    logger('Database connected Successfully!')
    const customersStream = fs.createReadStream(customersCsvFilePath)
    customersStream.pipe(parser);
    let customerRows: ICustomer[] = [];
    await new Promise((resolve, reject) => {
      parser.on('data', async function (row) {
        customerRows.push(row);
        if(customerRows.length === BATCH_SIZE) {
          await db('customers').insert(row)
          customerRows = []
        }
      })
      parser.on('end', () => {
        resolve(1)
      })
    })
    logger('Seed Complete!')

    return true;
  } catch (err) {
    logger(err);
    return false;
  } finally {
    db.destroy();
    parser.destroy();
  }
};

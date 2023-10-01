import * as csv from 'fast-csv';
import { ICompanies, CompaniesCSV } from '../challenge-2/constants';
import { logger } from './logger';

export const getDataFromCSV: (csvFilePath: string) => Promise<ICompanies[]> = (
  csvFilePath,
) => {
  return new Promise((resolve, reject) => {
    const data: ICompanies[] = [];
    csv
      .parseFile(csvFilePath, { headers: true })
      .on('error', (err) => {
        logger(err);
        reject(0);
      })
      .on('data', (row: Record<string, string>) => {
        data?.push({
          name: row?.[CompaniesCSV.name],
          ycUrl: row?.[CompaniesCSV.ycUrl],
        });
      })
      .on('end', () => {
        logger('Parsed Compnany website list');
        resolve(data);
      });
  });
};

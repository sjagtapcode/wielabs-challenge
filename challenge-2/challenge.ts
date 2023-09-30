import { getDataFromCSV } from '../helpers/csv';
import { logger } from '../helpers/logger';

const csvFilePath = './challenge-2/inputs/companies.csv';

/**
 * The entry point function. This will read the provided CSV file, scrape the companies'
 * YC pages, and output structured data in a JSON file.
 */
export async function processCompanyList() {
  try {
    const companies = await getDataFromCSV(csvFilePath);
  } catch (err) {
    logger(err);
  }
}

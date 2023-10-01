import { getDataFromCSV } from '../helpers/csv';
import { logger } from '../helpers/logger';
import { webScrap } from '../helpers/challenge-2/scrap';
import fs from 'fs-extra';

const csvFilePath = './challenge-2/inputs/companies.csv';

/**
 * The entry point function. This will read the provided CSV file, scrape the companies'
 * YC pages, and output structured data in a JSON file.
 */
export async function processCompanyList() {
  try {
    const companies = await getDataFromCSV(csvFilePath);
    const jsonData = await webScrap(companies?.map(({ ycUrl }) => ycUrl));

    await fs.ensureDir('./out');
    await fs.writeJson('./out/scraped.json', jsonData);
  } catch (err) {
    logger(err);
  }
}

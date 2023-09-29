import path from 'path';
import fs from 'fs-extra';
import knex from 'knex';
import { logger } from './logger';

export const developmentConfig = {
  client: 'sqlite3',
  connection: {
    filename: path.resolve('./out', 'database.sqlite3'),
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.resolve('./db/migrations'),
  },
};

/* Performs Migrations on the Database
 * returns true on success else returns false
*/
export const dbMigration = async () => {
  try {
    const db = knex(developmentConfig)
    try {
      await fs.ensureDir('./out');
      logger('Migrating database.');
      await db.migrate.latest();
      logger('Migrated Successfully!');
      return true;
    } catch (err) {
      logger(err);
      return false;
    } finally {
      await db.destroy();
    }
  } catch (err) {
    logger(err);
    return false;
  }
}

import path from 'path';
import fs from 'fs-extra';

fs.ensureDirSync('./out');

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const development = {
    client: 'sqlite3',
    connection: {
      filename: path.resolve('./out', 'database.sqlite3'),
    },
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    },
  };

export { development }

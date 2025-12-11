import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

import { schema } from './index';

export type DatabaseType = 'sqlite';

export function createDatabaseConnection(type: DatabaseType, config: any) {
  switch (type) {
    case 'sqlite':
      const sqlite = new Database(config.path);
      sqlite.pragma('journal_mode = WAL');
      return drizzle(sqlite, { schema });

    default:
      throw new Error(`Unsupported database type: ${type}`);
  }
}

export function createMigrator(db: any, type: DatabaseType) {
  switch (type) {
    case 'sqlite':
      return migrate(db, { migrationsFolder: './drizzle' });
    default:
      throw new Error(`Unsupported database type for migration: ${type}`);
  }
}

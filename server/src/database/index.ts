import { config } from '../config';
import { logger } from '../utils/logger';
import {
  DatabaseType,
  createDatabaseConnection,
  createMigrator,
} from './connections';

import { users } from '../api/users/user.schema';
import { categories } from '../api/categories/category.schema';
import { products } from '../api/products/product.schema';

export const schema = { users, categories, products };

export const db = createDatabaseConnection(
  config.database.type as DatabaseType,
  config.database
);

export function initializeDatabase() {
  logger.info(
    { type: config.database.type, path: config.database.path },
    '🗄️  Connecting to database...'
  );

  if (config.env === 'production') {
    createMigrator(db, config.database.type as DatabaseType);
    logger.info('📦 Database migrations applied');
  } else {
    logger.info('📦 Skipping migrations in development (using db:push)');
  }
}

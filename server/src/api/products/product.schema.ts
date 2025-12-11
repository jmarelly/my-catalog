import {
  sqliteTable,
  text,
  real,
  integer,
  index,
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { categories } from '../categories/category.schema';

export const products = sqliteTable(
  'products',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    price: real('price').notNull(),
    categoryId: text('category_id')
      .notNull()
      .references(() => categories.id),
    description: text('description').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(
      sql`(unixepoch())`
    ),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
      sql`(unixepoch())`
    ),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  },
  table => [
    index('idx_products_category').on(table.categoryId),
    index('idx_products_name').on(table.name),
  ]
);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

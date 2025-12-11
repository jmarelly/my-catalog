import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  role: text('role', { enum: ['admin', 'customer'] })
    .notNull()
    .default('admin'),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

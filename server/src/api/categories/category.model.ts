import { eq, sql } from 'drizzle-orm';
import { db } from '../../database';
import { categories, Category } from './category.schema';

export class CategoryModel {
  findAll(): Category[] {
    return db.select().from(categories).all();
  }

  findById(id: string): Category | undefined {
    return db.select().from(categories).where(eq(categories.id, id)).get();
  }

  findByIds(ids: string[]): Category[] {
    if (ids.length === 0) return [];

    return db
      .select()
      .from(categories)
      .where(
        sql`${categories.id} IN (${sql.join(
          ids.map(id => sql`${id}`),
          sql`, `
        )})`
      )
      .all();
  }
}

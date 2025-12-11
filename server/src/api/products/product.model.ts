import { eq, like, or, sql, desc, asc, isNull, and, SQL } from 'drizzle-orm';
import { db } from '../../database';
import { products, Product, NewProduct } from './product.schema';

type WhereCondition = SQL<unknown> | undefined;

export class ProductModel {
  findAll(options?: {
    condition?: WhereCondition;
    limit?: number;
    offset?: number;
  }) {
    const { condition, limit, offset } = options || {};

    let query = db.select().from(products);

    let whereCondition: SQL<unknown> = isNull(products.deletedAt);
    if (condition) {
      whereCondition = and(whereCondition, condition) as SQL<unknown>;
    }

    query = query.where(whereCondition) as typeof query;

    if (limit) {
      query = query.limit(limit) as typeof query;
    }

    if (offset) {
      query = query.offset(offset) as typeof query;
    }

    return query.orderBy(sql`${products.name} COLLATE NOCASE`).all();
  }

  count(where?: WhereCondition): number {
    let query = db.select({ count: sql<number>`count(*)` }).from(products);

    let whereCondition: SQL<unknown> = isNull(products.deletedAt);
    if (where) {
      whereCondition = and(whereCondition, where) as SQL<unknown>;
    }

    query = query.where(whereCondition) as typeof query;

    const result = query.get();
    return result?.count || 0;
  }

  findById(id: string): Product | undefined {
    return db
      .select()
      .from(products)
      .where(and(eq(products.id, id), isNull(products.deletedAt)))
      .get();
  }

  findByIds(ids: string[]): Product[] {
    if (ids.length === 0) return [];

    return db
      .select()
      .from(products)
      .where(
        and(
          sql`${products.id} IN (${sql.join(
            ids.map(id => sql`${id}`),
            sql`, `
          )})`,
          isNull(products.deletedAt)
        )
      )
      .all();
  }

  create(product: NewProduct): void {
    db.insert(products).values(product).run();
  }

  update(id: string, data: Partial<NewProduct>): number {
    const result = db
      .update(products)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(products.id, id), isNull(products.deletedAt)))
      .run();

    return result.changes;
  }

  softDelete(id: string): number {
    const result = db
      .update(products)
      .set({ deletedAt: new Date() })
      .where(and(eq(products.id, id), isNull(products.deletedAt)))
      .run();

    return result.changes;
  }

  buildSearchCondition(search?: string): WhereCondition | undefined {
    if (!search) {
      return undefined; // No condition for empty search
    }

    return or(
      like(products.name, `%${search}%`),
      like(products.description, `%${search}%`)
    );
  }
}

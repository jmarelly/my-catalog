import { eq } from 'drizzle-orm';
import { db } from '../../database';
import { users, User, NewUser } from './user.schema';

export class UserModel {
  findById(id: string): User | undefined {
    return db.select().from(users).where(eq(users.id, id)).get();
  }

  findByUsername(username: string): User | undefined {
    return db
      .select()
      .from(users)
      .where(eq(users.username, username.toLowerCase()))
      .get();
  }

  create(user: NewUser): void {
    db.insert(users).values(user).run();
  }
}

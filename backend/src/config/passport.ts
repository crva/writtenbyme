import { eq } from "drizzle-orm";
import passport from "passport";
import { usersTable } from "../db/schema.js";
import { db } from "../lib/db.js";
import type { AuthPayload } from "../types/user.js";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));

    const user = users[0];

    if (!user) {
      return done(null, null);
    }

    const authPayload: AuthPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      isPaid: user.isPaid,
      polarSubscriptionId: user.polarSubscriptionId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    done(null, authPayload);
  } catch (error) {
    done(error);
  }
});

export default passport;

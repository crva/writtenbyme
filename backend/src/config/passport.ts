import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { usersTable } from "../db/schema";
import { db } from "../lib/db";
import type { AuthPayload } from "../types/user";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const users = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, email));

        const user = users[0];

        if (!user) {
          return done(null, false, { message: "Invalid credentials" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          return done(null, false, { message: "Invalid credentials" });
        }

        const authPayload: AuthPayload = {
          id: user.id,
          username: user.username,
          email: user.email,
          isPaid: user.isPaid,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };

        return done(null, authPayload);
      } catch (error) {
        return done(error);
      }
    }
  )
);

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
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    done(null, authPayload);
  } catch (error) {
    done(error);
  }
});

export default passport;

import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("User", {
  id: text("id").primaryKey(),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  isPaid: boolean("isPaid").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const magicLinksTable = pgTable(
  "MagicLink",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    token: text("token").unique().notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    used: boolean("used").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("MagicLink_email_idx").on(table.email),
    index("MagicLink_token_idx").on(table.token),
  ],
);

export const articlesTable = pgTable(
  "Article",
  {
    id: text("id").primaryKey(),
    userId: text("userId").notNull(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [
    index("Article_userId_idx").on(table.userId),
    uniqueIndex("Article_userId_title_key").on(table.userId, table.title),
    uniqueIndex("Article_userId_slug_key").on(table.userId, table.slug),
  ],
);

export const articleViewsTable = pgTable(
  "ArticleView",
  {
    id: text("id").primaryKey(),
    articleId: text("articleId").notNull(),
    userAgent: text("userAgent").notNull(),
    country: text("country"),
    os: text("os"),
    browser: text("browser"),
    sessionDuration: integer("sessionDuration"),
    maxScrollPercentage: integer("maxScrollPercentage").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("ArticleView_articleId_idx").on(table.articleId),
    index("ArticleView_createdAt_idx").on(table.createdAt),
  ],
);

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  articles: many(articlesTable),
}));

export const articlesRelations = relations(articlesTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [articlesTable.userId],
    references: [usersTable.id],
  }),
  views: many(articleViewsTable),
}));

export const articleViewsRelations = relations(
  articleViewsTable,
  ({ one }) => ({
    article: one(articlesTable, {
      fields: [articleViewsTable.articleId],
      references: [articlesTable.id],
    }),
  }),
);

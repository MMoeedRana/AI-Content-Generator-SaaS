import { boolean, pgTable, serial, text, varchar, integer } from "drizzle-orm/pg-core";

export const AIOutput=pgTable('AIOutput',{
  id:serial('id').primaryKey(),
  formData:varchar('formData').notNull(),
  aiResponse:text('aiResponse'),
  wordCount: integer('wordCount').default(0),
  templateSlug:varchar('templateSlug').notNull(),
  createdBy:varchar('createdBy').notNull(),
  createdAt:varchar('createdAt')
});

export const UserSubscription = pgTable("userSubscription", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }),
  userName: varchar("userName", { length: 255 }),
  active: boolean("active"),
  paymentId: varchar("paymentId", { length: 255 }),
  joinDate: varchar("joinDate", { length: 255 }),
});

export const UserReviews = pgTable('userReviews', {
    id: serial('id').primaryKey(),
    userName: varchar('userName').notNull(),
    userEmail: varchar('userEmail').notNull(),
    userImage: varchar('userImage'),
    rating: integer('rating').notNull(), // 1 to 5 stars
    reviewText: text('reviewText'),
    createdAt: varchar('createdAt').notNull(),
});
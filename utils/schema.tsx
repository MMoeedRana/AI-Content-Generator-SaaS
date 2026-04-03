import { sql } from "drizzle-orm";
import { boolean, pgTable, serial, text, varchar, timestamp, uuid, } from "drizzle-orm/pg-core";

export const AIOutput=pgTable('AIOutput',{
  id:serial('id').primaryKey(),
  formData:varchar('formData').notNull(),
  aiResponse:text('aiResponse'),
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
  joinDate: varchar("joinDate", { length: 255 }), // typo fixed: joinData ➜ joinDate
});
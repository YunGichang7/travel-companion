import { pgTable, text, serial, integer, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameKorean: text("name_korean").notNull(),
  description: text("description").notNull(),
  region: text("region").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  rating: real("rating").notNull(),
  tags: text("tags").array().notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
});

export const swipeActions = pgTable("swipe_actions", {
  id: serial("id").primaryKey(),
  destinationId: integer("destination_id").notNull(),
  action: text("action").notNull(), // 'like' or 'pass'
  sessionId: text("session_id").notNull(),
});

export const insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true,
});

export const insertSwipeActionSchema = createInsertSchema(swipeActions).omit({
  id: true,
});

export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinations.$inferSelect;
export type InsertSwipeAction = z.infer<typeof insertSwipeActionSchema>;
export type SwipeAction = typeof swipeActions.$inferSelect;

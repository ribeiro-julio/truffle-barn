import { pgTable, serial, text } from 'drizzle-orm/pg-core'

export const secret = pgTable('secret', {
  id: serial('id').primaryKey(),
  value: text('value').notNull(),
  detector: text('detector').notNull()
})

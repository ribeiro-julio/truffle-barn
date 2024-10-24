import { boolean, pgEnum, pgTable, serial, text } from 'drizzle-orm/pg-core'

export const visibilitiesEnum = pgEnum('visibilities', ['private', 'public'])

export const repo = pgTable('repo', {
  id: serial('id').primaryKey(),
  owner: text('owner').notNull(),
  name: text('name').notNull(),
  archived: boolean('archived').notNull(),
  visibility: visibilitiesEnum().notNull()
})

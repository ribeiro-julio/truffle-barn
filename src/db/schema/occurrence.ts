import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core'

import { repo } from './repo'
import { secret } from './secret'

export const occurrence = pgTable('occurrence', {
  id: serial('id').primaryKey(),
  repoId: integer('repo_id')
    .references(() => repo.id)
    .notNull(),
  secretId: integer('secret_id')
    .references(() => secret.id)
    .notNull(),
  commit: text('commit').notNull(),
  url: text('url').notNull()
})

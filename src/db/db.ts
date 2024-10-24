import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import * as schema from './schema'
import { env } from '../env'

let pool: Pool | null = null
const getPool = (): Pool => {
  if (!pool) {
    pool = new Pool({ connectionString: env.DB_URL })
  }
  return pool
}

export const db = drizzle({ client: getPool(), schema })

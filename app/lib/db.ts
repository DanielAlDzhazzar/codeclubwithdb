import pkg from 'pg'
const { Pool } = pkg

const isProduction = process.env.NODE_ENV === 'production'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
  ssl: isProduction ? { rejectUnauthorized: false } : false,
})

export async function query<T = any>(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const res = await client.query(text, params)
    return res as { rows: T[] }
  } finally {
    client.release()
  }
}

console.log("DB URL:", process.env.DATABASE_URL)
import { query } from '@/app/lib/db'

export async function GET() {
  const { rows } = await query(`
    SELECT id, name FROM events ORDER BY id DESC
  `)

  return Response.json(rows)
}
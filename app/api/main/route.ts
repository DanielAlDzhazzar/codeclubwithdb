import { query } from '../../lib/db'

export async function GET() {
  const { rows } = await query(
    'SELECT id, name FROM main ORDER BY id ASC'
  )

  return new Response(JSON.stringify(rows), {
    headers: { 'Content-Type': 'application/json' },
  })
}
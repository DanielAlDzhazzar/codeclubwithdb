import { query } from '@/app/lib/db'

export async function GET() {
  try {
    const { rows } = await query(`
      SELECT id, name, email, role
      FROM users
      ORDER BY id ASC
    `)

    return Response.json(rows)

  } catch (err) {
    console.error('USERS ERROR:', err)
    return Response.json([])
  }
}
import { query } from '@/app/lib/db'
import { getUserFromToken } from '../../lib/auth'

export async function GET(req: Request) {
  const user = await getUserFromToken(req)

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { rows } = await query(`
    SELECT id, role, dob
    FROM users
    WHERE id = $1
  `, [user.id])

  return Response.json(rows[0])
}
import { query } from '@/app/lib/db'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const SECRET = 'supersecretkey'

export async function GET() {
  try {
    const token = (await cookies()).get('token')?.value

    if (!token) {
      return Response.json([])
    }

    const user: any = jwt.verify(token, SECRET)

    const { rows } = await query(
      `SELECT id, name FROM users WHERE parent_id = $1`,
      [user.id]
    )

    return Response.json(rows)

  } catch {
    return Response.json([])
  }
}
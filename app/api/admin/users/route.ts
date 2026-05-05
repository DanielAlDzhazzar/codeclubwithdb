import { query } from '@/app/lib/db'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const SECRET = 'supersecretkey'

async function getAdmin() {
  const token = (await cookies()).get('token')?.value
  if (!token) return null

  try {
    return jwt.verify(token, SECRET) as any
  } catch {
    return null
  }
}

export async function GET() {
  const admin = await getAdmin()

  if (!admin || admin.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { rows } = await query(`
    SELECT id, name, email, role, active
    FROM users
    ORDER BY id ASC
  `)

  return Response.json(rows)
}

export async function POST(req: Request) {
  const admin = await getAdmin()

  if (!admin || admin.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id, role, active } = await req.json()

  await query(
    `UPDATE users SET role=$1, active=$2 WHERE id=$3`,
    [role, active, id]
  )

  return Response.json({ success: true })
}
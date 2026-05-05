import { query } from '@/app/lib/db'
import { verifyToken } from '@/app/lib/auth'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const token = (await cookies()).get('token')?.value
    const user: any = token ? verifyToken(token) : null

    if (!user) {
      return Response.json([])
    }

    const { rows } = await query(`
      SELECT 
        b.id,
        b.event_technology_id,
        u.name as ninja_name
      FROM bookings b
      JOIN users u ON u.id = b.ninja_id
      WHERE b.user_id = $1
    `, [user.id])

    return Response.json(rows)
  } catch (err) {
    console.error(err)
    return Response.json([])
  }
}
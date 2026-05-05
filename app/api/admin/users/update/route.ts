import { query } from '@/app/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { id, role } = body

    await query(
      `UPDATE users SET role=$1 WHERE id=$2`,
      [role, id]
    )

    return Response.json({ success: true })

  } catch (err) {
    console.error('UPDATE USER ERROR:', err)
    return Response.json({ success: false })
  }
}
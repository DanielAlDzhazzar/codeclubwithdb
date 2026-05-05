import { query } from '@/app/lib/db'

export async function POST(req: Request) {
  try {
    const { booking_id, event_technology_id } = await req.json()

    if (!booking_id || !event_technology_id) {
      return Response.json({ error: 'Missing data' }, { status: 400 })
    }

    await query(`DELETE FROM bookings WHERE id=$1`, [booking_id])

    await query(
      `UPDATE event_technologies
       SET remaining_slots = remaining_slots + 1
       WHERE id=$1`,
      [event_technology_id]
    )

    return Response.json({ success: true })
  } catch (err) {
    console.error('CANCEL ERROR:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
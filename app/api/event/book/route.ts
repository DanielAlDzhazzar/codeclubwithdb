import { query } from '@/app/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { event_technology_id, ninja_id, user_id } = body

    if (!event_technology_id) {
      return Response.json({ error: 'Missing event_technology_id' }, { status: 400 })
    }

    const slotCheck = await query(`
      SELECT remaining_slots 
      FROM event_technologies 
      WHERE id = $1
    `, [event_technology_id])

    if (slotCheck.rows.length === 0) {
      return Response.json({ error: 'Event not found' }, { status: 404 })
    }

    if (slotCheck.rows[0].remaining_slots <= 0) {
      return Response.json({ error: 'No slots left' }, { status: 400 })
    }

    const duplicate = await query(`
      SELECT id FROM bookings 
      WHERE event_technology_id = $1 AND ninja_id = $2
    `, [event_technology_id, ninja_id || user_id])

    if (duplicate.rows.length > 0) {
      return Response.json({ error: 'Already booked' }, { status: 400 })
    }

    await query(`
      INSERT INTO bookings (event_technology_id, user_id, ninja_id)
      VALUES ($1, $2, $3)
    `, [event_technology_id, user_id, ninja_id || user_id])

    await query(`
      UPDATE event_technologies
      SET remaining_slots = remaining_slots - 1
      WHERE id = $1
    `, [event_technology_id])

    return Response.json({ success: true })

  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
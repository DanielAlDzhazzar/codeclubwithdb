import { query } from './../../../../lib/db'

export async function GET(_: any, context: any) {
  try {
    const params = await context.params
    const id = Number(params.id)

    if (!id) {
      return Response.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const eventRes = await query(
      `SELECT id, name, description, event_date, start_time, end_time
       FROM events
       WHERE id = $1`,
      [id]
    )

    if (eventRes.rows.length === 0) {
      return Response.json({ error: 'Event not found' }, { status: 404 })
    }

    const techRes = await query(
      `SELECT technology_id, total_slots, room
       FROM event_technologies
       WHERE event_id = $1`,
      [id]
    )

    return Response.json({
      ...eventRes.rows[0],
      tickets: techRes.rows || []
    })

  } catch (err: any) {
    console.error(err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
import { query } from '@/app/lib/db'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const SECRET = 'supersecretkey'

export async function GET() {
  const { rows } = await query(
    'SELECT id, name FROM events ORDER BY id DESC'
  )
  return Response.json(rows)
}

export async function POST(req: Request) {
  const body = await req.json()

  const event = body.event
  const tickets = body.tickets

  const eventRes = await query(
    `INSERT INTO events (name, description, event_date, start_time, end_time)
     VALUES ($1,$2,$3,$4,$5) RETURNING id`,
    [event.name, event.description, event.event_date, event.start_time, event.end_time]
  )

  const eventId = eventRes.rows[0].id

  for (const t of tickets) {
  await query(
    `INSERT INTO event_technologies (event_id, technology_id, slots, room)
     VALUES ($1, $2, $3, $4)`,
    [eventId, t.technology_id, t.total_slots, t.room]
  )
}

  return Response.json({ success: true })
}
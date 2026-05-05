import { query } from '@/app/lib/db'

export async function GET(_: Request, { params }: any) {
  const id = Number(params.id)

  const event = await query(`SELECT * FROM events WHERE id=$1`, [id])

  const tickets = await query(`
    SELECT * FROM event_technologies WHERE event_id=$1
  `, [id])

  return Response.json({
    event: event.rows[0],
    tickets: tickets.rows
  })
}
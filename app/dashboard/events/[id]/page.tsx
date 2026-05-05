import { query } from '@/app/lib/db'

export default async function EventDetail(props: any) {
  const params = await props.params
  const id = Number(params.id)

  const { rows: event } = await query(`SELECT * FROM events WHERE id=$1`, [id])

  const { rows: techs } = await query(`
    SELECT et.*, m.name
    FROM event_technologies et
    JOIN main m ON et.technology_id = m.id
    WHERE et.event_id = $1
  `, [id])

  return (
    <main className="p-6">
      <h1>{event[0].name}</h1>

      {techs.map(t => (
        <form key={t.id} action="/api/bookings/create" method="POST">
          <h3>{t.name}</h3>
          <p>Slots left: {t.remaining_slots}</p>

          <input type="hidden" name="event_technology_id" value={t.id} />

          <button className="bg-green-500 text-white p-2 mt-2">
            Book
          </button>
        </form>
      ))}
    </main>
  )
}
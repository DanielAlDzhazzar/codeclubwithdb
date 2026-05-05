export const dynamic = 'force-dynamic'

import clsx from 'clsx'
import { query } from './../../lib/db'
import BookButton from './components/BookButton'
import CancelBooking from './components/CancelBooking'

type Event = {
  id: number
  name: string
  description: string
  event_date: string
  start_time: string
  end_time: string
}

type EventTech = {
  id: number   
  event_id: number
  technology_id: number
  total_slots: number
  remaining_slots: number
  room: string
  tech_name: string
}

async function getEvents(): Promise<Event[]> {
  const { rows } = await query<Event>(`
    SELECT id, name, description, event_date, start_time, end_time
    FROM events
    ORDER BY event_date ASC
  `)
  return rows
}

async function getEventTech(): Promise<EventTech[]> {
  const { rows } = await query<EventTech>(`
    SELECT 
      et.id,
      et.event_id,
      et.technology_id,
      et.total_slots,
      et.remaining_slots,
      et.room,
      t.name as tech_name
    FROM event_technologies et
    JOIN main t ON t.id = et.technology_id
  `)
  return rows
}

export default async function EventsPage() {
  const events = await getEvents()
  const techs = await getEventTech()

  return (
    <main>
      <CancelBooking />

      <section className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">

        {events.map(event => {
          const relatedTech = techs.filter(t => t.event_id === event.id)

          return (
            <div
              key={event.id}
              className="flex flex-col justify-between p-4 rounded-lg text-black h-full"
              style={{ backgroundColor: '#F8F8F8' }}
            >

              <div className="flex flex-col items-center">

                <h2 className={clsx('text-2xl font-semibold')}>
                  {event.name}
                </h2>

                <p className="mt-2 text-center">
                  {event.description}
                </p>

                <p className="mt-2 text-sm">
                  {new Date(event.event_date).toLocaleDateString()} | {event.start_time} - {event.end_time}
                </p>

                <div className="mt-4 w-full">
                  {relatedTech.map(t => (
                    <div key={t.id} className="border border-black rounded p-2 mt-2">

                      <p className="font-semibold">{t.tech_name}</p>
                      <p className="text-sm">Room: {t.room}</p>
                      <p className="text-sm">
                        Slots: {t.remaining_slots} / {t.total_slots}
                      </p>

                      <BookButton techId={t.id} />

                    </div>
                  ))}
                </div>

              </div>

            </div>
          )
        })}

      </section>
    </main>
  )
}
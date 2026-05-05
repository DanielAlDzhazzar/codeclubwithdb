'use client'

import { useState, useEffect } from 'react'

export default function AddEvent() {
  const [techs, setTechs] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])

  const [event, setEvent] = useState({
    name: '',
    description: '',
    event_date: '',
    start_time: '',
    end_time: ''
  })

  const [tickets, setTickets] = useState([
    { technology_id: '', total_slots: 20, room: '' }
  ])

  useEffect(() => {
    fetch('/api/main')
      .then(res => res.json())
      .then(setTechs)
  }, [])

  useEffect(() => {
    fetch('/api/admin/events')
      .then(res => res.json())
      .then(setEvents)
  }, [])

  const handleEventChange = (e: any) => {
    setEvent({ ...event, [e.target.name]: e.target.value })
  }

  const handleTicketChange = (i: number, e: any) => {
    const copy = [...tickets]
    copy[i] = { ...copy[i], [e.target.name]: e.target.value }
    setTickets(copy)
  }

  const addTicket = () => {
    setTickets([...tickets, { technology_id: '', total_slots: 20, room: '' }])
  }

  const loadEvent = async (id: string) => {
  if (!id) return

  try {
    const res = await fetch(`/api/admin/events/${id}`)

    if (!res.ok) {
      const text = await res.text()
      console.error('Bad response:', text)
      alert('Failed to load event')
      return
    }

    const data = await res.json()

    setEvent({
      name: data.name || '',
      description: data.description || '',
      event_date: data.event_date || '',
      start_time: data.start_time || '',
      end_time: data.end_time || ''
    })

    setTickets(
      (data.tickets || []).map((t: any) => ({
        technology_id: String(t.technology_id),
        total_slots: t.total_slots,
        room: t.room || ''
      }))
    )

  } catch (err) {
    console.error(err)
    alert('Error loading event')
  }
}

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const res = await fetch('/api/admin/events', {
      method: 'POST',
      body: JSON.stringify({
        event,
        tickets: tickets.map(t => ({
          ...t,
          technology_id: Number(t.technology_id),
          total_slots: Number(t.total_slots)
        }))
      })
    })

    const data = await res.json()
    alert(data.success ? 'Created' : data.error)
  }

  return (
    <main className="flex justify-center mt-5">
      <div className="flex flex-col p-4 rounded-lg text-black" style={{ backgroundColor: '#F8F8F8' }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <h1 className="text-3xl text-center">Create Event</h1>

          <div>
            <label>Load Existing Event</label>
            <select
              onChange={(e) => loadEvent(e.target.value)}
              className="w-full mt-1 p-2 border border-black rounded"
            >
              <option value="">Select</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.id} - {ev.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Name</label>
            <input name="name" value={event.name} onChange={handleEventChange}
              className="w-full mt-1 p-2 border border-black rounded" />
          </div>

          <div>
            <label>Description</label>
            <input name="description" value={event.description} onChange={handleEventChange}
              className="w-full mt-1 p-2 border border-black rounded" />
          </div>

          <div>
            <label>Date</label>
            <input type="date" name="event_date" value={event.event_date} onChange={handleEventChange}
              className="w-full mt-1 p-2 border border-black rounded" />
          </div>

          <div>
            <label>Start Time</label>
            <input type="time" name="start_time" value={event.start_time} onChange={handleEventChange}
              className="w-full mt-1 p-2 border border-black rounded" />
          </div>

          <div>
            <label>End Time</label>
            <input type="time" name="end_time" value={event.end_time} onChange={handleEventChange}
              className="w-full mt-1 p-2 border border-black rounded" />
          </div>

          <h2 className="text-xl mt-4">Tickets</h2>

          {tickets.map((t, i) => (
            <div key={i}>
              <label>Technology</label>
              <select
                name="technology_id"
                value={t.technology_id}
                onChange={(e) => handleTicketChange(i, e)}
                className="w-full p-2 border border-black rounded"
              >
                <option value="">Select</option>
                {techs.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.id} - {t.name}
                  </option>
                ))}
              </select>

              <label>Slots</label>
              <input
                name="total_slots"
                value={t.total_slots}
                onChange={(e) => handleTicketChange(i, e)}
                className="w-full mt-1 p-2 border border-black rounded"
              />

              <label>Room</label>
              <input
                name="room"
                value={t.room}
                onChange={(e) => handleTicketChange(i, e)}
                className="w-full mt-1 p-2 border border-black rounded"
              />
            </div>
          ))}

          <button type="button" onClick={addTicket}
            className="bg-gray-300 p-2 rounded">
            Add Another Tech
          </button>

          <button className="bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600 transition">
            Create Event
          </button>

        </form>
      </div>
    </main>
  )
}
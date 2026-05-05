'use client'

import { useEffect, useState } from 'react'

export default function CancelBooking() {
  const [bookings, setBookings] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)

  useEffect(() => {
    fetch('/api/my-bookings')
      .then(res => res.json())
      .then(setBookings)
  }, [])

  const cancel = async () => {
    if (!selected) return

    const res = await fetch('/api/cancel', {
      method: 'POST',
      body: JSON.stringify({
        booking_id: selected.id,
        event_technology_id: selected.event_technology_id
      })
    })

    const text = await res.text()

    let data
    try {
      data = JSON.parse(text)
    } catch {
      console.error('NOT JSON:', text)
      alert('Server error')
      return
    }

    if (data.success) {
      alert('Cancelled')
      setBookings(prev => prev.filter(b => b.id !== selected.id))
      setSelected(null)
    } else {
      alert(data.error)
    }
  }

  if (bookings.length === 0) return null

  return (
    <div className="mb-6 p-4 border border-black rounded bg-white text-black">

      <h2 className="text-lg font-semibold mb-2">
        Cancel Booking
      </h2>

      <select
        className="border p-2 w-full mb-2"
        onChange={(e) => {
          const found = bookings.find(b => String(b.id) === e.target.value)
          setSelected(found)
        }}
      >
        <option value="">Select booking</option>

        {bookings.map(b => (
          <option key={b.id} value={b.id}>
            {b.id} - {b.ninja_name}
          </option>
        ))}
      </select>

      <button
        onClick={cancel}
        className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
      >
        Cancel
      </button>

    </div>
  )
}
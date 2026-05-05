'use client'

import { useEffect, useState } from 'react'

function calculateAge(dob: string) {
  const birth = new Date(dob)
  const today = new Date()

  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

export default function BookButton({ techId }: { techId: number }) {
  const [user, setUser] = useState<any>(null)
  const [children, setChildren] = useState<any[]>([])
  const [child, setChild] = useState('')

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(setUser)
  }, [])

  useEffect(() => {
    if (user?.role === 'parent') {
      fetch('/api/my-children')
        .then(res => res.json())
        .then(setChildren)
    }
  }, [user])

  if (!user) return null

  const isParent = user.role === 'parent'

  const age = user.dob ? calculateAge(user.dob) : null

  if (!isParent && age !== null && age <= 12) {
    return null
  }

  const handleBook = async () => {
    const res = await fetch('/api/event/book', {
      method: 'POST',
      body: JSON.stringify({
        event_technology_id: techId,
        user_id: user.id,
        ninja_id: child || user.id
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
      alert('Booked')
      window.location.reload()
    } else {
      alert(data.error)
    }
  }

  return (
    <div className="flex flex-col items-center mt-2">

      {isParent && (
        <select
          onChange={(e) => setChild(e.target.value)}
          className="border border-black p-1 rounded mb-2"
        >
          <option value="">Select child</option>
          {children.map(c => (
            <option key={c.id} value={c.id}>
              {c.id} - {c.name}
            </option>
          ))}
        </select>
      )}

      <button
        onClick={handleBook}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
      >
        Book
      </button>

    </div>
  )
}
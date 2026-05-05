'use client'

import { useEffect, useState } from 'react'

type User = {
  id: number
  name: string
  email: string
  role: string
  active: boolean
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])

  async function loadUsers() {
    try {
      const res = await fetch('/api/admin/users')

      if (!res.ok) {
        const text = await res.text()
        console.error('NOT JSON:', text)
        alert('Server error')
        return
      }

      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.error(err)
      alert('Failed request')
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const updateUser = async (id: number, role: string, active: boolean) => {
    const res = await fetch('/api/admin/users/update', {
      method: 'POST',
      body: JSON.stringify({ id, role, active })
    })

    const data = await res.json()

    if (data.success) {
      loadUsers()
    } else {
      alert(data.error)
    }
  }

  return (
    <main className="flex flex-col p-4 rounded-lg text-black" style={{ backgroundColor: '#F8F8F8' }}>
      <h1 className="text-2xl mb-4">Manage Users</h1>

      {users.map(u => (
        <div key={u.id} className="border p-3 mb-3">

          <p>{u.id} - {u.name} ({u.email})</p>

          <select
            defaultValue={u.role}
            onChange={(e) => updateUser(u.id, e.target.value, u.active)}
            className="border p-1 mr-2"
          >
            <option value="ninja">ninja</option>
            <option value="parent">parent</option>
            <option value="admin">admin</option>
          </select>

          <select
            defaultValue={String(u.active)}
            onChange={(e) =>
              updateUser(u.id, u.role, e.target.value === 'true')
            }
            className="border p-1"
          >
            <option value="true">active</option>
            <option value="false">dormant</option>
          </select>

        </div>
      ))}
    </main>
  )
}
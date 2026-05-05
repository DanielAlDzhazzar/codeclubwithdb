'use client'

import { useEffect, useState } from 'react'

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])

  const loadUsers = async () => {
    const res = await fetch('/api/admin/users')
    const text = await res.text()

    try {
      setUsers(JSON.parse(text))
    } catch {
      console.error('NOT JSON:', text)
      alert('Failed to load users')
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const updateUser = async (id: number, role: string, active: boolean) => {
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify({ id, role, active })
    })

    const text = await res.text()

    try {
      const data = JSON.parse(text)
      if (!data.success) throw new Error()
      alert('Updated')
      loadUsers()
    } catch {
      console.error('NOT JSON:', text)
      alert('Update failed')
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl mb-4">Manage Users</h1>

      {users.map(user => (
        <div
          key={user.id}
          className="border border-black p-3 mb-3 rounded bg-gray-100"
        >
          <p><b>ID:</b> {user.id}</p>
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>

          <div className="mt-2">
            <label>Role</label>
            <select
              defaultValue={user.role}
              onChange={(e) =>
                updateUser(user.id, e.target.value, user.active)
              }
              className="ml-2 border p-1"
            >
              <option value="ninja">ninja</option>
              <option value="parent">parent</option>
              <option value="admin">admin</option>
            </select>
          </div>

          <div className="mt-2">
            <label>Active</label>
            <select
              defaultValue={String(user.active)}
              onChange={(e) =>
                updateUser(
                  user.id,
                  user.role,
                  e.target.value === 'true'
                )
              }
              className="ml-2 border p-1"
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </div>
        </div>
      ))}
    </main>
  )
}
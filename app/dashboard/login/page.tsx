'use client'

import { useState } from 'react'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(form)
    })

    const data = await res.json()

    if (data.success) {
      window.location.href = '/dashboard'
    } else {
      alert(data.error)
    }
  }

  return (
    <main className="flex justify-center mt-5">
      <div className="flex flex-col items-center justify-between p-4 rounded-lg text-black h-full" style={{ backgroundColor: '#F8F8F8' }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-black">

          <h1 className="text-3xl font-semibold text-center text-black">
            Login
          </h1>

          <div>
            <label>Email</label>
            <input name="email" onChange={handleChange}
              className="w-full mt-1 p-2 rounded border border-black text-black" required />
          </div>

          <div>
            <label>Password</label>
            <input type="password" name="password" onChange={handleChange}
              className="w-full mt-1 p-2 rounded border border-black text-black" required />
          </div>

          <button className="bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600 transition">
            Login
          </button>

        </form>
      </div>
    </main>
  )
}
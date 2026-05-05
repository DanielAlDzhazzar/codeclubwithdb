'use client'

import { useState } from 'react'

function calculateAge(dob: string) {
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    gender: '',
    parent_id: '',
    parent_ref: ''
  })

  const age = form.dob ? calculateAge(form.dob) : null

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const payload: any = { ...form }

    if (age !== null && age <= 12) {
      payload.parent_id = Number(form.parent_id)
    } else {
      payload.parent_id = null
    }

    if (!(age !== null && age >= 18)) {
      payload.parent_ref = null
    }

    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    })

    const data = await res.json()
    alert(data.error || 'Registered')
  }

  return (
    
    <main className="flex justify-center mt-5">
       <div className="flex flex-col items-center justify-between p-4 rounded-lg text-black h-full" style={{ backgroundColor: '#F8F8F8' }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-black">

          <h1 className="text-3xl font-semibold text-center text-black">
            Register
          </h1>

          <div>
            <label>Name</label>
            <input name="name" onChange={handleChange}
              className="w-full mt-1 p-2 rounded border border-black text-black" required />
          </div>

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

          <div>
            <label>Date of Birth</label>
            <input type="date" name="dob" onChange={handleChange}
              className="w-full mt-1 p-2 rounded border border-black text-black" required />
          </div>

          <div>
            <label>Gender</label>
            <select name="gender" onChange={handleChange}
              className="w-full mt-1 p-2 rounded border border-black text-black" required>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {age !== null && age <= 12 && (
            <div>
              <label>Parent ID</label>
              <input name="parent_id" onChange={handleChange}
                className="w-full mt-1 p-2 rounded border border-black text-black" required />
            </div>
          )}

          {age !== null && age >= 18 && (
            <div>
              <label>Parent Reference</label>
              <input name="parent_ref" onChange={handleChange}
                className="w-full mt-1 p-2 rounded border border-black text-black" />
            </div>
          )}

          <button className="bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600 transition">
            Register
          </button>

        </form>
      </div>
    </main>
  )
}
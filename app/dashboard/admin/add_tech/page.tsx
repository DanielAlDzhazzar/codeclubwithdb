'use client'

import { useState, useEffect } from 'react'

export default function AddTech() {
  const [categories, setCategories] = useState<any[]>([])

  const [form, setForm] = useState({
    name: '',
    description: '',
    category_id: '',
    image_url: '',
    image_alt: '',
    width: '500',
    height: '500',
    bg: '',
    active: 'true',
    images: ''
  })

  useEffect(() => {
    fetch('/api/main')
      .then(res => res.json())
      .then(setCategories)
  }, [])

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const res = await fetch('/api/admin/technologies', {
      method: 'POST',
      body: JSON.stringify({
        ...form,
        category_id: Number(form.category_id),
        width: Number(form.width),
        height: Number(form.height),
        active: form.active === 'true',
        images: form.images
          ? form.images.split(',').map((i: string) => i.trim())
          : []
      })
    })

    const data = await res.json()
    alert(data.success ? 'Added' : data.error)
  }

  return (
    <main className="flex justify-center mt-5">
      <div className="flex flex-col p-4 rounded-lg text-black" style={{ backgroundColor: '#F8F8F8' }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <h1 className="text-3xl font-semibold text-center">
            Add Technology
          </h1>

          <div>
            <label>Name</label>
            <input name="name" onChange={handleChange}
              className="w-full mt-1 p-2 rounded border border-black" required />
          </div>

          <div>
            <label>Description</label>
            <input name="description" onChange={handleChange}
              className="w-full mt-1 p-2 rounded border border-black" required />
          </div>

          <div>
            <label>Category</label>
            <select name="category_id" onChange={handleChange}
              className="w-full mt-1 p-2 rounded border border-black text-black" required>
              <option value="">Select</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.id} - {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Main Image</label>
            <input name="image_url" onChange={handleChange}
              className="w-full mt-1 p-2 rounded border border-black" required />
          </div>

          <div>
            <label>Image Alt</label>
            <input name="image_alt" onChange={handleChange}
              className="w-full mt-1 p-2 rounded border border-black" required />
          </div>

          <div>
            <label>Width</label>
            <input name="width" onChange={handleChange}
              className="w-full mt-1 p-2 rounded border border-black" required />
          </div>

          <div>
            <label>Height</label>
            <input name="height" onChange={handleChange}
              className="w-full mt-1 p-2 rounded border border-black" required />
          </div>

          <div>
            <label>Background</label>
            <input name="bg" onChange={handleChange}
              className="w-full mt-1 p-2 rounded border border-black" />
          </div>

          <div>
            <label>Active</label>
            <select name="active" onChange={handleChange}
              className="w-full mt-1 p-2 rounded border border-black text-black">
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>

          <div>
            <label>Extra Images</label>
            <input name="images" onChange={handleChange}
              className="w-full mt-1 p-2 rounded border border-black"
              placeholder="url1, url2, url3" />
          </div>

          <button className="bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600 transition">
            Add
          </button>

        </form>
      </div>
    </main>
  )
}
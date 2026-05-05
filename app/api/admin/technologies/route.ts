import { query } from '@/app/lib/db'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const SECRET = 'supersecretkey'

export async function POST(req: Request) {
  const token = (await cookies()).get('token')?.value

  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  let user: any

  try {
    user = jwt.verify(token, SECRET)
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 })
  }

  if (user.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
  }

  const body = await req.json()

  const {
    name,
    description,
    category_id,
    image_url,
    image_alt,
    width,
    height,
    bg,
    active,
    images
  } = body

  const techRes = await query(
    `INSERT INTO technologies
     (name, description, category_id, image_url, image_alt, width, height, bg, active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING id`,
    [name, description, category_id, image_url, image_alt, width, height, bg || '#F8F8F8', active]
  )

  const techId = techRes.rows[0].id

  if (images && images.length > 0) {
    for (const img of images) {
      await query(
        `INSERT INTO technology_images (technology_id, image_url)
         VALUES ($1,$2)`,
        [techId, img]
      )
    }
  }

  return new Response(JSON.stringify({ success: true }))
}
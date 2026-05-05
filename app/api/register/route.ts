import { query } from '@/app/lib/db'
import { hashPassword } from '@/app/lib/auth'

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

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      name,
      email,
      password,
      dob,
      gender,
      parent_id,
      parent_ref
    } = body

    if (!name || !email || !password || !dob || !gender) {
      return Response.json({ error: 'Missing fields' }, { status: 400 })
    }

    const age = calculateAge(dob)

    let role = 'ninja'

    if (age <= 12) {
      role = 'child'
    }

    if (age >= 18 && parent_ref) {
      role = 'parent'
    }

    if (age <= 12 && !parent_id) {
      return Response.json({ error: 'Child must have parent_id' }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    await query(`
      INSERT INTO users (name, email, password, dob, gender, parent_id, parent_ref, role)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `, [
      name,
      email,
      hashedPassword,
      dob,
      gender,
      parent_id || null,
      parent_ref || null,
      role
    ])

    return Response.json({ success: true })

  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
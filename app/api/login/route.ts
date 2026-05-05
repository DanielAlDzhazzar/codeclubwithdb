import { query } from '@/app/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const SECRET = 'supersecretkey'

export async function POST(req: Request) {
  const body = await req.json()
  const { email, password } = body

  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 })
  }

  const { rows } = await query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  )

  const user = rows[0]

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 400 })
  }

  const valid = await bcrypt.compare(password, user.password)

  if (!valid) {
    return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 400 })
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    SECRET,
    { expiresIn: '7d' }
  )

  return new Response(JSON.stringify({ success: true }), {
    headers: {
      'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=604800`
    }
  })
}
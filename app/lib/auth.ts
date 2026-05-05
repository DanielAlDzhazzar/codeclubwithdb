import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const SECRET = 'supersecretkey'

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export async function getUserFromToken(req: Request) {
  const token = (await cookies()).get('token')?.value

  if (!token) return null

  const user = verifyToken(token)

  return user
}

export function createToken(user: any) {
  return jwt.sign(
    { id: user.id, role: user.role },
    SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}
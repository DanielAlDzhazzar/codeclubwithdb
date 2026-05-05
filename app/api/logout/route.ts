import { cookies } from 'next/headers'

export async function GET() {
  (await cookies()).set('token', '', { maxAge: 0 })
  return new Response(JSON.stringify({ success: true }))
}
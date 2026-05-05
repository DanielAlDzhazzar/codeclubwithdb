import { query } from '../../lib/db'

export async function GET() {
  try {
    const { rows } = await query(
      `SELECT id, name, image_url, image_alt, width, height
      FROM background
      WHERE id = $1`, [2])

    const logo = rows[0] || null

    return new Response(JSON.stringify(logo), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Failed to fetch logo:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch logo' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
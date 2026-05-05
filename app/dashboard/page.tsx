export const dynamic = 'force-dynamic'

import Link from 'next/link'
import clsx from 'clsx'
import { query } from './../lib/db'

type Title = {
  id: number
  name: string
  description: string
  bg?: string | null
}

interface MainCard {
  id: number
  name: string
  image_url: string
  image_alt: string
  description: string
  width: number
  height: number
  bg: string
}

async function getMainCards(): Promise<MainCard[]> {
  const { rows } = await query<MainCard>(`
    SELECT id, name, image_url, image_alt, description, width, height, bg
    FROM main
    ORDER BY id ASC
  `)
  return rows
}

async function getTitleById(id: number): Promise<Title | null> {
  const res = await query<Title>('SELECT * FROM titles WHERE id = $1', [id])
  return res.rows[0] || null
}

export default async function Dashboard() {
  const cards = await getMainCards()
  const title = await getTitleById(1)

  return (
    <main>
      <section>
        {title && (
          <div
            key={title.id}
            className="mt-8 flex flex-col items-center justify-between p-4 rounded-lg text-black h-full border-6 border-black"
            style={{ backgroundColor: title.bg || '#F8F8F8' }}
          >
            <h2 className={clsx('text-3xl font-semibold', 'font-head')}>
              {title.name}
            </h2>
            <p className={clsx('text-lg mt-4 text-center', 'font-body')}>
              {title.description}
            </p>
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(card => (
            <div
              key={card.id}
              className="flex flex-col items-center justify-between p-4 rounded-lg text-black h-full"
              style={{ backgroundColor: card.bg || '#F8F8F8' }}
            >
              <div className="flex flex-col items-center">
                <img
                  className="mb-3"
                  src={card.image_url}
                  width={card.width}
                  height={card.height}
                  alt={card.image_alt}
                />
                <h3 className="md-3 text-2xl font-medium">{card.name}</h3>
                <p className="text-md mt-2">{card.description}</p>
              </div>

              <Link
                href={`/dashboard/${card.id}`}
                className="mt-4 inline-block no-underline bg-blue-500 text-white rounded-[10px] font-bold border border-blue-500 px-3.75 py-2.5 hover:bg-blue-600 transition"
              >
                Explore {card.name} projects
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
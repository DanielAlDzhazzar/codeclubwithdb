export const dynamic = 'force-dynamic'

import clsx from 'clsx'
import Link from 'next/link'
import { query } from './../../lib/db'

type Title = {
  id: number
  name: string
  description: string
  bg?: string | null
}

type Card = {
  id: number
  name: string
  image_url: string
  image_alt: string
  description: string
  width: number
  height: number
  bg: string | null
  extra_image: string | null
}

async function getMainCards(categoryId: number) {
  const { rows } = await query<Card>(
    `SELECT t.*, ti.image_url AS extra_image
     FROM technologies t
     LEFT JOIN technology_images ti
     ON t.id = ti.technology_id
     WHERE t.category_id = $1 AND t.active = true
     ORDER BY t.id ASC`,
    [categoryId]
  )

  const map: any = {}

  rows.forEach(r => {
    if (!map[r.id]) {
      map[r.id] = { ...r, images: [] }
    }
    if (r.extra_image) {
      map[r.id].images.push(r.extra_image)
    }
  })

  return Object.values(map)
}

async function getTitleById(id: number): Promise<Title | null> {
  const res = await query<Title>(
    'SELECT * FROM titles WHERE id = $1',
    [id]
  )
  return res.rows[0] || null
}

export default async function Page(props: any) {
  const params = await props.params
  const id = Number(params.id)

  if (!id || isNaN(id)) {
    return <div>Not found</div>
  }

  const cards: any[] = await getMainCards(id)
  const title = await getTitleById(id)

  return (
    <main>
      <section>
        {title && (
          <div
            key={title.id}
            className="mt-8 flex flex-col items-center justify-between p-4 rounded-lg text-black h-full border-6 border-black"
            style={{ backgroundColor: title.bg || '#F8F8F8' }}
          >
            <h2 className={clsx("text-3xl font-semibold", "font-head")}>
              {title.name}
            </h2>
            <p className={clsx("text-lg mt-4 text-center", "font-body")}>
              {title.description}
            </p>
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
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

                {card.images.map((img: string, i: number) => (
                  <img
                    key={i}
                    src={img}
                    width={card.width}
                    height={card.height}
                    className="mb-2"
                  />
                ))}

                <h3 className="md-3 text-2xl font-medium">{card.name}</h3>
                <p className="text-md mt-2">{card.description}</p>

                <Link href={`/dashboard/tutorial/${card.id}`}
                  className="mt-4 inline-block no-underline bg-blue-500 text-white rounded-[10px] font-bold border border-blue-500 px-3.75 py-2.5 hover:bg-blue-600 transition">
                  Tutorial
                </Link>

              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
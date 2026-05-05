export const dynamic = 'force-dynamic'

import { query } from './../../../lib/db'

async function getTutorial(id: number) {
  const { rows } = await query(
    'SELECT content FROM tutorials WHERE technology_id = $1',
    [id]
  )
  return rows[0]
}

export default async function Page(props: any) {
  const params = await props.params
  const id = Number(params.id)

  if (!id || isNaN(id)) {
    return <div>Not found</div>
  }

  const tutorial = await getTutorial(id)

  if (!tutorial) {
    return <div>No tutorial found</div>
  }

  return (
    <main className="flex justify-center mt-5">
      <div
        className="flex flex-col p-4 rounded-lg text-black max-w-175"
        style={{ backgroundColor: '#F8F8F8' }}
      >
        <h1 className="text-2xl mb-4 text-center">Tutorial</h1>
        <p className="text-md whitespace-pre-line">
          {tutorial.content}
        </p>
      </div>
    </main>
  )
}
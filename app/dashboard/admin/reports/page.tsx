import { query } from '@/app/lib/db'

function calculateAge(dob: string) {
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

export default async function Reports() {

  const techReport = await query(`
    SELECT m.name, COUNT(b.id) as total
    FROM bookings b
    JOIN event_technologies et ON b.event_technology_id = et.id
    JOIN main m ON et.technology_id = m.id
    GROUP BY m.name
    `)

  const attendees = await query(`
    SELECT 
      u.id,
      u.name,
      u.gender,
      u.dob,
      t.name as technology
    FROM bookings b
    JOIN event_technologies et ON b.event_technology_id = et.id
    JOIN technologies t ON et.technology_id = t.id
    JOIN users u ON b.ninja_id = u.id
  `)

  const rows = attendees.rows

  const ageGroups: any = {
    '0-12': 0,
    '13-17': 0,
    '18+': 0
  }

  rows.forEach((u: any) => {
    const age = calculateAge(u.dob)

    if (age <= 12) ageGroups['0-12']++
    else if (age <= 17) ageGroups['13-17']++
    else ageGroups['18+']++
  })

  const genderGroups: any = {
    male: 0,
    female: 0,
    other: 0
  }

  rows.forEach((u: any) => {
    if (u.gender === 'male') genderGroups.male++
    else if (u.gender === 'female') genderGroups.female++
    else genderGroups.other++
  })

  const csv = [
    ['ID', 'Name', 'Gender', 'DOB', 'Technology'],
    ...rows.map((u: any) => [
      u.id,
      u.name,
      u.gender,
      u.dob,
      u.technology
    ])
  ]
    .map(r => r.join(','))
    .join('\n')

  return (
    <main className="flex flex-col p-4 rounded-lg text-black" style={{ backgroundColor: '#F8F8F8' }}>

      <h1 className="text-2xl font-bold">Reports</h1>

      <div>
        <h2 className="text-xl mb-2">Attendees per Technology</h2>
        {techReport.rows.map((r: any) => (
          <div key={r.name}>
            {r.name}: {r.total}
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl mb-2">Age Profile</h2>
        {Object.entries(ageGroups).map(([group, count]) => (
          <div key={group}>
            {group}: {count as number}
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl mb-2">Gender Profile</h2>
        {Object.entries(genderGroups).map(([g, count]) => (
          <div key={g}>
            {g}: {count as number}
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl mb-2">Export</h2>

        <a
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
          download="attendees.csv"
          className="bg-green-500 text-white px-4 py-2 rounded inline-block"
        >
          Download CSV
        </a>
      </div>

    </main>
  )
}
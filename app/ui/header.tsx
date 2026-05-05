'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type MainItem = {
  id: number
  name: string
}

type Logo = {
  id: number
  name: string
  image_url: string
  image_alt: string
  width: number
  height: number
}

type User = {
  id: number
  name: string
  role: string
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [logo, setLogo] = useState<Logo | null>(null)
  const [mainItems, setMainItems] = useState<MainItem[]>([])
  const [user, setUser] = useState<User | null>(null)

  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/logo').then(res => res.json()).then(setLogo)
  }, [])

  useEffect(() => {
    fetch('/api/main').then(res => res.json()).then(setMainItems)
  }, [])

  useEffect(() => {
    fetch('/api/me').then(res => res.json()).then(setUser)
  }, [])

  const isActive = (id: number) => {
    return pathname === `/dashboard/${id}` || (id === 0 && pathname === '/dashboard')
  }

  const buttonBaseClasses =
    "inline-block no-underline rounded-[10px] font-bold border w-24 text-center py-1 text-lg transition"

  const buttonActiveClasses = "bg-blue-700 text-white border-blue-700"
  const buttonInactiveClasses = "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"

  const logout = async () => {
    document.cookie = 'token=; Max-Age=0; path=/'
    setUser(null)
  }

  return (
    <header className="relative">
      <div className="flex items-center justify-between relative">

        {logo && (
          <div className="flex items-center">
            <img
              src={logo.image_url}
              alt={logo.image_alt}
              width={logo.width}
              height={logo.height}
            />
          </div>
        )}

        <button
          onClick={() => setMenuOpen(true)}
          className="text-3xl md:hidden focus:outline-none cursor-pointer"
        >
          &#9776;
        </button>

        <nav className="
          hidden md:flex text-sm relative
          md:flex-wrap md:max-w-[600px] md:gap-2
          lg:flex-nowrap lg:max-w-none lg:text-xl
          lg:absolute lg:-top-3.75 lg:-right-33.5
          lg:flex-col lg:items-center lg:space-x-0 lg:space-y-3
          lg:bg-[#65d849] lg:border-4 lg:border-dotted lg:border-red-500 lg:p-2
        ">

          <Link
            href="/dashboard"
            className={`${buttonBaseClasses} ${pathname === '/dashboard' ? buttonActiveClasses : buttonInactiveClasses}`}
          >
            Home
          </Link>

          {mainItems.map(item => (
            <Link
              key={item.id}
              href={`/dashboard/${item.id}`}
              className={`${buttonBaseClasses} ${isActive(item.id) ? buttonActiveClasses : buttonInactiveClasses}`}
            >
              {item.name}
            </Link>
          ))}

          {user?.role === 'admin' && (
            <Link href="/dashboard/admin/add_tech" className={buttonBaseClasses + ' ' + buttonInactiveClasses}>
              Add Tech
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link href="/dashboard/admin/add_event" className={buttonBaseClasses + ' ' + buttonInactiveClasses}>
              AddEvent
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link href="/dashboard/admin/users" className={buttonBaseClasses + ' ' + buttonInactiveClasses}>
              Edit Users
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link href="/dashboard/admin/reports" className={buttonBaseClasses + ' ' + buttonInactiveClasses}>
              Reports
            </Link>
          )}

          <Link
            href="/dashboard/events"
            className={buttonBaseClasses + ' ' + buttonInactiveClasses}
          >
            Events
          </Link>

          {!user ? (
            <>
              <Link href="/dashboard/login" className={buttonBaseClasses + ' ' + buttonInactiveClasses}>
                Login
              </Link>

              <Link href="/dashboard/register" className={buttonBaseClasses + ' ' + buttonInactiveClasses}>
                Register
              </Link>
            </>
          ) : (
            <button onClick={logout} className={buttonBaseClasses + ' ' + buttonInactiveClasses}>
              Logout
            </button>
          )}

        </nav>
      </div>

      {menuOpen && (
        <section className="fixed inset-0 bg-green-500 text-5xl flex flex-col items-center z-50 overflow-y-auto">

          <button
            onClick={() => setMenuOpen(false)}
            className="text-8xl self-end px-6 pt-10"
          >
            &times;
          </button>

          <nav className="flex flex-col items-center py-8 w-full">

            <Link onClick={() => setMenuOpen(false)} href="/dashboard" className="w-full text-center py-6">
              Home
            </Link>

            {mainItems.map(item => (
              <Link
                key={item.id}
                href={`/dashboard/${item.id}`}
                onClick={() => setMenuOpen(false)}
                className="w-full text-center py-6"
              >
                {item.name}
              </Link>
            ))}

            {user?.role === 'admin' && (
              <>
                <Link href="/dashboard/admin/add_tech" onClick={() => setMenuOpen(false)} className="py-6">
                  Add Tech
                </Link>
                <Link href="/dashboard/admin/add_event" onClick={() => setMenuOpen(false)} className="py-6">
                  Add Event
                </Link>
                <Link href="/dashboard/admin/users" onClick={() => setMenuOpen(false)} className="py-6">
                  Edit Users
                </Link>
                <Link href="/dashboard/admin/reports" onClick={() => setMenuOpen(false)} className="py-6">
                  Reports
                </Link>
              </>
            )}

            <Link href="/dashboard/events" onClick={() => setMenuOpen(false)} className="py-6">
              Events
            </Link>

            {!user ? (
              <>
                <Link href="/dashboard/login" className="py-6">Login</Link>
                <Link href="/dashboard/register" className="py-6">Register</Link>
              </>
            ) : (
              <button onClick={logout} className="py-6">Logout</button>
            )}

          </nav>
        </section>
      )}
    </header>
  )
}
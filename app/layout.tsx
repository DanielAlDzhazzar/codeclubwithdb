import './globals.css'
import Header from '@/app/ui/header'
import Footer from '@/app/ui/footer'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-cyan-300">
        <div className="mx-auto my-5 min-w-75 max-w-250 bg-[#65d849] border-[5px] border-dotted border-red-500 p-2.5">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}
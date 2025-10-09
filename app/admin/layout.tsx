'use client'

import { ReactNode } from 'react'
import { IoChevronBack } from 'react-icons/io5'

import { LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Redirect to login page
        router.push('/login')
      } else {
        console.error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="max-h-screen">
      <header>
        <div className="max-w-full lg:max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button 
              onClick={() => window.history.back()} 
              className="flex items-center text-black font-bold text-xl"
            >
              <IoChevronBack className="w-5 h-5 mr-1" />
              Back
            </button>
            <h1 className="flex items-center text-black font-bold text-xl absolute left-1/2 transform -translate-x-1/2">Admin</h1>
            {/* <button 
              onClick={handleLogout}
              className="flex items-center text-red-600 hover:text-red-800 font-bold text-sm transition-colors"
              title="Logout"
            >
              <LogIn className="w-5 h-5 mr-1" />
            </button> */}
          </div>
        </div>
      </header>
      <main className="max-w-full lg:max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

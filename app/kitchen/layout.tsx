'use client'

import { ReactNode } from 'react'
import { IoChevronBack } from 'react-icons/io5'


interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {



  return (
    <div className="h-auto min-h-screen">
        <header>
          <div className="max-w-full lg:max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <button 
                onClick={() => window.history.back()} 
                className="flex items-center text-typography-heading font-black text-2xl cursor-pointer"
              >
                <IoChevronBack className="w-5 h-5 mr-1" />
                Back
              </button>
              <h1 className="flex items-center text-typography-heading font-black text-2xl absolute left-1/2 transform -translate-x-1/2">Kitchen</h1>
            </div>
          </div>
        </header>
        <main className="max-w-full lg:max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
  )
}

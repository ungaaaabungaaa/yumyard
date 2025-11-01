'use client'

import { ReactNode } from 'react'
import { IoChevronBack } from 'react-icons/io5'
import { useParams } from 'next/navigation'


interface TablesLayoutProps {
  children: ReactNode
}

export default function TablesCheckoutLayout({ children }: TablesLayoutProps) {
  const params = useParams()
  
  // Extract tableNumber synchronously from params (Next.js 15 supports this)
  const tableNumber = params?.tableNumber 
    ? (Array.isArray(params.tableNumber) ? params.tableNumber[0] : params.tableNumber)
    : ''

  return (
    <div className="h-auto min-h-screen">
      <header className="sticky top-0 z-50 bg-white">
        <div className="max-w-full lg:max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.history.back();
                }
              }} 
              className="flex items-center text-typography-heading font-black text-2xl cursor-pointer"
            >
              <IoChevronBack className="w-5 h-5 mr-1" />
              Back
            </button>
            <h1 className="flex items-center text-typography-heading font-black text-2xl absolute left-1/2 transform -translate-x-1/2">
              Table {tableNumber} Checkout
            </h1>
          </div>
        </div>
      </header>
      <main className="max-w-full lg:max-w-2xl mx-auto py-6 px-2 sm:px-2 lg:px-4">
        {children}
      </main>
    </div>
  )
}

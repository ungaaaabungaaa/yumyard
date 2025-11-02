'use client'

import { ReactNode, useState, useEffect } from 'react'
import { IoChevronBack } from 'react-icons/io5'
import { useParams } from 'next/navigation'
import BottomNavigation from '@/components/ui/BottomNavigation'


interface TablesLayoutProps {
  children: ReactNode
}

export default function TablesExploreLayout({ children }: TablesLayoutProps) {
  const params = useParams()
  const [mounted, setMounted] = useState(false)
  const [tableNumber, setTableNumber] = useState('')
  
  useEffect(() => {
    setMounted(true)
    // Extract tableNumber from params after mount to avoid hydration mismatch
    if (params?.tableNumber) {
      const tableNum = Array.isArray(params.tableNumber) 
        ? params.tableNumber[0] 
        : params.tableNumber
      setTableNumber(tableNum || '')
    }
  }, [params])

  return (
    <div className="h-auto min-h-screen pb-20">
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
              {mounted && tableNumber ? `Table ${tableNumber} Explore` : 'Table Explore'}
            </h1>
          </div>
        </div>
      </header>
      <main className="max-w-full lg:max-w-2xl mx-auto py-6 px-2 sm:px-2 lg:px-4">
        {children}
      </main>
      <BottomNavigation />
    </div>
  )
}

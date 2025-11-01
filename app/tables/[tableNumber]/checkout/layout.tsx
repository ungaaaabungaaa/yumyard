'use client'

import { ReactNode, useState, useEffect } from 'react'
import { IoChevronBack } from 'react-icons/io5'
import { useParams } from 'next/navigation'

interface TablesLayoutProps {
  children: ReactNode
}

export default function TablesLayout({ children }: TablesLayoutProps) {
  const params = useParams()
  const [tableNumber, setTableNumber] = useState('')
  
  useEffect(() => {
    const resolveParams = async () => {
      if (params && typeof params === 'object' && 'then' in params) {
        const resolved = await (params as unknown as Promise<{ tableNumber?: string | string[] }>)
        const tableNum = Array.isArray(resolved?.tableNumber) ? resolved.tableNumber[0] : resolved?.tableNumber
        setTableNumber(tableNum || '')
      } else {
        const tableNum = Array.isArray(params.tableNumber) ? params.tableNumber[0] : params.tableNumber
        setTableNumber(tableNum || '')
      }
    }
    resolveParams()
  }, [params])
  const headerClassName = "sticky top-0 z-50 bg-white";

  // Validate table number is between 1-10
  const tableNum = parseInt(tableNumber, 10);
  const isValid = !isNaN(tableNum) && tableNum >= 1 && tableNum <= 10;

  // Show 404 if invalid table number
  if (!isValid) {
    return (
      <div className="h-auto min-h-screen">
        <main className="max-w-full lg:max-w-2xl mx-auto py-6 px-2 sm:px-2 lg:px-4">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-typography-heading mb-4">
                404
              </h2>
              <p className="text-xl text-typography-secondary mb-2">
                Table not found
              </p>
              <p className="text-lg text-typography-secondary mb-6">
                Only tables 1-10 are available
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-auto min-h-screen">
      <header className={headerClassName}>
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
              Table {tableNumber}
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

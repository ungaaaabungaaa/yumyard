'use client'

import { ReactNode, useState, useEffect } from 'react'
import { useParams, usePathname } from 'next/navigation'
import BottomNavigation from '@/components/ui/BottomNavigation'
import { IoChevronBack } from 'react-icons/io5'
import { CartProvider } from './context/CartContext'

interface TablesLayoutProps {
  children: ReactNode
}

export default function TablesLayout({ children }: TablesLayoutProps) {
  const params = useParams()
  const pathname = usePathname()
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

  // Validate table number is between 1-10
  // Only validate if we have a tableNumber (don't show 404 while loading)
  const tableNum = tableNumber ? parseInt(tableNumber, 10) : null;
  const isValid = tableNum !== null && !isNaN(tableNum) && tableNum >= 1 && tableNum <= 10;
  const hasTableNumber = mounted && tableNumber !== '';

  // Check if we're on a child route that has its own layout (only after mount to avoid hydration mismatch)
  const childRoutes = ['/cart', '/checkout', '/details', '/explore']
  const isChildRoute = mounted && pathname ? childRoutes.some(route => pathname.includes(route)) : false

  // Show 404 only if we have a tableNumber but it's invalid (and after mount)
  if (mounted && hasTableNumber && !isValid) {
    return (
      <CartProvider>
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
      </CartProvider>
    );
  }

  // If it's a child route with its own layout, just pass through children
  // Note: We only check this after mount to ensure consistent SSR/client render
  if (isChildRoute) {
    return <CartProvider>{children}</CartProvider>
  }

  // Otherwise, render the main table layout
  // Always render the same structure initially to avoid hydration mismatch
  return (
    <CartProvider>
      <div className="h-auto min-h-screen pb-20 bg-background-surface-background">
        <header className="sticky top-0 z-50 bg-background-surface-background">
          <div className="max-w-full lg:max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4 bg-transparent">
              <button 
                
                className="flex items-center text-transparent font-black text-2xl cursor-pointer"
              >
                <IoChevronBack className="w-5 h-5 mr-1 text-transparent" />
                Back
              </button>
              <h1 className="flex items-center text-typography-heading font-black text-2xl absolute left-1/2 transform -translate-x-1/2">
                { `Table ${tableNumber} ` }
              </h1>
            </div>
          </div>
        </header>
        <main className="max-w-full lg:max-w-2xl mx-auto py-6 px-2 sm:px-2 lg:px-4">
          {children}
        </main>
        <BottomNavigation />
      </div>
    </CartProvider>
  )
}

'use client'

import { ReactNode } from 'react'
import { useParams, usePathname } from 'next/navigation'

interface TablesLayoutProps {
  children: ReactNode
}

export default function TablesLayout({ children }: TablesLayoutProps) {
  const params = useParams()
  const pathname = usePathname()
  
  // Extract tableNumber synchronously from params (Next.js 15 supports this)
  const tableNumber = params?.tableNumber 
    ? (Array.isArray(params.tableNumber) ? params.tableNumber[0] : params.tableNumber)
    : ''
  
  const headerClassName = "sticky top-0 z-50 bg-white";

  // Validate table number is between 1-10
  // Only validate if we have a tableNumber (don't show 404 while loading)
  const tableNum = tableNumber ? parseInt(tableNumber, 10) : null;
  const isValid = tableNum !== null && !isNaN(tableNum) && tableNum >= 1 && tableNum <= 10;
  const hasTableNumber = tableNumber !== '';

  // Check if we're on a child route that has its own layout
  const childRoutes = ['/cart', '/checkout', '/details', '/explore']
  const isChildRoute = childRoutes.some(route => pathname?.includes(route))

  // Show 404 only if we have a tableNumber but it's invalid
  // Don't show 404 if tableNumber is still loading (empty string)
  if (hasTableNumber && !isValid) {
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

  // If it's a child route with its own layout, just pass through children
  if (isChildRoute) {
    return <>{children}</>
  }

  // Otherwise, render the main table layout
  return (
   


<div className="h-auto min-h-screen">
<header className={headerClassName}>
  <div className="max-w-full lg:max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between py-4">
      
      <h1 className="flex items-center text-typography-heading font-black text-2xl absolute left-1/2 transform -translate-x-1/2"> Table {tableNumber}</h1>
    </div>
  </div>
</header>
<main className="max-w-full lg:max-w-2xl mx-auto py-6 px-2 sm:px-2 lg:px-4">
  {children}
</main>
</div>






  )
}

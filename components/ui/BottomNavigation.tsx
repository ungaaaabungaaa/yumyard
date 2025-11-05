'use client'

import { useParams, usePathname, useRouter } from 'next/navigation'
import { Home, Compass, ShoppingCart } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function BottomNavigation() {
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const [tableNumber, setTableNumber] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (params?.tableNumber) {
      const tableNum = Array.isArray(params.tableNumber) 
        ? params.tableNumber[0] 
        : params.tableNumber
      setTableNumber(tableNum || '')
    }
  }, [params])

  if (!mounted || !tableNumber) {
    return null
  }

  const basePath = `/tables/${tableNumber}`
  const homePath = basePath
  const explorePath = `${basePath}/explore`
  const cartPath = `${basePath}/cart`

  // Check if we're on checkout or details page - these should show Home as active
  const isCheckoutOrDetails = pathname?.includes('/checkout') || pathname?.includes('/details')

  const isActive = (path: string) => {
    if (path === homePath) {
      // Home is active if we're on home page OR on checkout/details pages
      return pathname === homePath || isCheckoutOrDetails
    }
    return pathname?.startsWith(path)
  }

  const navigationItems = [
    {
      label: 'Home',
      icon: Home,
      path: homePath,
      active: isActive(homePath),
    },
    {
      label: 'Explore',
      icon: Compass,
      path: explorePath,
      active: isActive(explorePath),
    },
    {
      label: 'Cart',
      icon: ShoppingCart,
      path: cartPath,
      active: isActive(cartPath),
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 ">
      <div className="max-w-full mx-auto">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className="flex flex-col items-center justify-center px-4 py-1 min-w-[80px] transition-colors relative"
                aria-label={item.label}
              >
                <Icon
                  className={`w-6 h-6 mb-1 transition-colors ${
                    item.active ? 'text-green-600' : 'text-gray-500'
                  }`}
                />
                
                {item.active && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[4px] border-l-transparent border-r-transparent border-b-green-600" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}


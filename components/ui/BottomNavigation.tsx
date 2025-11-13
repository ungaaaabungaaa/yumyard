'use client'

import { useParams, usePathname, useRouter } from 'next/navigation'
import { Home, Compass, ShoppingCart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCart } from '@/app/tables/[tableNumber]/context/CartContext'

// Create a separate component for cart badge
function CartBadge() {
  // Since BottomNavigation is only used in tables layout (wrapped with CartProvider),
  // we can safely use the hook here
  const { getTotalItems } = useCart()
  const cartCount = getTotalItems()
  
  if (cartCount > 0) {
    return (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
        {cartCount > 9 ? '9+' : cartCount}
      </span>
    )
  }
  return null
}

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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background-surface-background ">
      <div className="max-w-full mx-auto">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isCart = item.label === 'Cart'
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className="flex flex-col items-center justify-center px-4 py-1 min-w-[80px] transition-colors relative"
                aria-label={item.label}
              >
                <div className="relative">
                  <Icon
                    className={`w-6 h-6 mb-1 transition-colors ${
                      item.active ? 'text-green-600' : 'text-gray-500'
                    }`}
                  />
                  {isCart && <CartBadge />}
                </div>
                
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


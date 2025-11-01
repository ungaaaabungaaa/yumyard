'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { IoChevronBack } from 'react-icons/io5'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { playNotificationSound, initializeAudioPermissions } from '@/lib/sounds'


interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const headerClassName = "sticky top-0 z-50 bg-white";
  
  // Fetch all kitchen orders (order-received and cooking status)
  const orders = useQuery(api.order.getKitchenOrdersWithMenuDetails);
  
  // Track previous orders to detect new ones
  const previousOrdersRef = useRef<typeof orders | undefined>(undefined);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Initialize audio permissions on component mount
  useEffect(() => {
    if (!audioInitialized) {
      initializeAudioPermissions()
        .then(success => {
          setAudioInitialized(success);
        })
        .catch(error => {
          console.error('Failed to initialize audio permissions:', error);
        });
    }
  }, [audioInitialized]);

  // Play notification sound when new orders arrive
  useEffect(() => {
    if (!orders || !previousOrdersRef.current) {
      // First load, don't play sound
      previousOrdersRef.current = orders;
      return;
    }
    
    // Check if there are new orders by comparing order counts
    if (orders.length > previousOrdersRef.current.length) {
      playNotificationSound().catch(error => {
        console.error('Failed to play notification sound:', error);
      });
    }
    
    previousOrdersRef.current = orders;
  }, [orders]);

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
              <h1 className="flex items-center text-typography-heading font-black text-2xl absolute left-1/2 transform -translate-x-1/2">Kitchen</h1>
            </div>
          </div>
        </header>
        <main className="max-w-full lg:max-w-2xl mx-auto py-6 px-2 sm:px-2 lg:px-4">
          {children}
        </main>
      </div>
  )
}

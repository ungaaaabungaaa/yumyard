'use client'

import { useRouter } from 'next/navigation'
import { User , Logs , AppWindow } from 'lucide-react'


export default function AdminPage() {

  const router = useRouter()
  const dashboardItems = [
    {
      title: 'My Earnings',
      value: '₹52,000',
      icon: <User className="w-6 h-6" />,
      onClick: () => router.push('/admin/dashboard')
    },
    {
      title: 'My Menu',
      value: '22 items',
      icon: <AppWindow className="w-6 h-6" />,
      onClick: () => router.push('/admin/menu')
    },
    {
      title: 'My Orders',
      value: '92',
      icon: <Logs className="w-6 h-6" />,
      onClick: () => router.push('/admin/orders')
    }
  ]
  return (
    <div className="space-y-4">
    {dashboardItems.map((item, index) => (
      <div
        key={index}
        onClick={item.onClick}
        className="flex items-center justify-between p-6 bg-background-layer-1-background rounded-xl"
      >
        <div className="flex items-center">
          <div className="flex items-center text-colors-icon-default mr-4">
            {item.icon}
          </div>
          <h2 className="text-lg font-light text-black">
            {item.title}
          </h2>
        </div>
        <div className="text-lg font-light text-black">
          {item.value}
        </div>
      </div>
    ))}
  </div>
  )
}

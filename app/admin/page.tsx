'use client'

import { useRouter } from 'next/navigation'
import { User , Logs , AppWindow } from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Spinner } from '@/components/ui/spinner'

export default function AdminPage() {

  const router = useRouter()
  const dashboardStats = useQuery(api.order.getDashboardStats)
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const dashboardItems = [
    {
      title: 'My Earnings',
      value: dashboardStats ? formatCurrency(dashboardStats.totalEarnings) : <Spinner className="w-4 h-4" />,
      icon: <User className="w-6 h-6" />,
      onClick: () => router.push('/admin/dashboard')
    },
    {
      title: 'My Menu',
      value: dashboardStats ? `${dashboardStats.totalMenuItems} items` : <Spinner className="w-4 h-4" />,
      icon: <AppWindow className="w-6 h-6" />,
      onClick: () => router.push('/admin/menu')
    },
    {
      title: 'My Orders',
      value: dashboardStats ? dashboardStats.totalOrders.toString() : <Spinner className="w-4 h-4" />,
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
        className="flex items-center justify-between p-6 bg-background-layer-1-background rounded-xl cursor-pointer"
      >
        <div className="flex items-center">
          <div className="flex items-center text-colors-icon-default mr-4">
            {item.icon}
          </div>
          <h2 className="text-lg font-light text-typography-heading">
            {item.title}
          </h2>
        </div>
        <div className="text-lg font-light text-typography-heading">
          {item.value}
        </div>
      </div>
    ))}
  </div>
  )
}

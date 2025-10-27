'use client'
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Image from "next/image";
import { Spinner } from '@/components/ui/spinner';

export default function AdminDashboard() {
  const dashboardStats = useQuery(api.order.getDashboardStats);
  
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
      title: 'Total Earnings',
      value: dashboardStats ? formatCurrency(dashboardStats.totalEarnings) : <Spinner className="w-4 h-4" />,
    },
    {
      title: 'Total Orders',
      value: dashboardStats ? dashboardStats.totalOrders.toString() : <Spinner className="w-4 h-4" />,
    },
    {
      title: 'Menu Items',
      value: dashboardStats ? dashboardStats.totalMenuItems.toString() : <Spinner className="w-4 h-4" />,
    }
  ]
  
  return (
    <div className=" p-6">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 w-full flex flex-col items-center justify-center">
          {/* Logo */}
          <div className="mb-6">
            <Image className="w-24 h-24 rounded-full" src="/logo.png" alt="Yum Yard Cafe" width={96} height={96} />
          </div>
          
          {/* Cafe Info */}
          <h1 className="text-typography-heading text-2xl font-black mb-2">Yum Yard Cafe</h1>
          <p className="text-typography-light-grey mb-2">Brigade El Dorado Rd, Gummanahalli...</p>
          <div className="flex text-typography-light-grey font-bold items-center justify-center">
            <span>+91 80501 69163</span>
          </div>
        </div>

      
        <div className='space-y-4'>
        {dashboardItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-6 bg-background-layer-1-background rounded-xl cursor-pointer"
          >
            <div className="flex items-center">
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

      </div>
    </div>
  )
}

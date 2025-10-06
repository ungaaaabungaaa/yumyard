import { ReactNode } from 'react'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
            <nav className="flex space-x-4">
              <a href="/admin/dashboard" className="text-gray-600 hover:text-gray-900 hover:font-bold">Dashboard</a>
              <a href="/admin/menu" className="text-gray-600 hover:text-gray-900 hover:font-bold">Menu</a>
              <a href="/admin/orders" className="text-gray-600 hover:text-gray-900 hover:font-bold">Orders</a>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

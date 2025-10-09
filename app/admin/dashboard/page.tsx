'use client'
export default function AdminDashboard() {
  const dashboardItems = [
    {
      title: 'Total Earnings',
      value: '₹52,000',
    },
    {
      title: 'Total Orders',
      value: '22 ',
    },
    {
      title: 'Menu Items',
      value: '92',
    }
  ]
  
  return (
    <div className=" p-6">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 w-full flex flex-col items-center justify-center">
          {/* Logo */}
          <div className="mb-6">
            <img className="w-24 h-24 rounded-full" src="/logo.png" alt="Yum Yard Cafe"  />
          </div>
          
          {/* Cafe Info */}
          <h1 className="text-typography-heading text-2xl font-black mb-2">Yum Yard Cafe</h1>
          <p className="text-typography-light-grey mb-2">Brigade El Dorado Rd, Gummanahalli...</p>
          <div className="flex text-typography-light-grey font-bold items-center justify-center">
            <span>+91 9945405632</span>
          </div>
        </div>

      
        <div className='space-y-4'>
        {dashboardItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-6 bg-background-layer-1-background rounded-xl"
          >
            <div className="flex items-center">
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

      </div>
    </div>
  )
}

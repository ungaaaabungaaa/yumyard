'use client'

import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface SegmentedControlProps {
  segments: {
    label: string
    path: string
  }[]
  className?: string
}

export function SegmentedControl({ segments, className }: SegmentedControlProps) {
  const pathname = usePathname()
  const router = useRouter()

  const activeIndex = segments.findIndex(segment => pathname === segment.path)

  const handleSegmentClick = (path: string) => {
    router.push(path)
  }

  return (
    <div className={cn(
      "relative flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200",
      className
    )}>
      {segments.map((segment, index) => (
        <button
          key={segment.path}
          onClick={() => handleSegmentClick(segment.path)}
          className={cn(
            "relative flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            activeIndex === index
              ? "bg-white text-gray-900 shadow-sm border border-gray-200"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          )}
        >
          {segment.label}
        </button>
      ))}
    </div>
  )
}

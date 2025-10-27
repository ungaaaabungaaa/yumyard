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
      "relative flex items-center bg-background-layer-2-background rounded-xl p-2",
      className
    )}>
      {segments.map((segment, index) => (
        <button
          key={segment.path}
          onClick={() => handleSegmentClick(segment.path)}
          className={cn(
            "relative flex-1 text-lg  font-bold py-4 px-6 rounded-2xl ",
            activeIndex === index
              ? "bg-background-surface-background text-typography-heading"
              : "text-typography-inactive"
          )}
        >
          {segment.label}
        </button>
      ))}
    </div>
  )
}

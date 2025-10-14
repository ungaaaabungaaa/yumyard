"use client";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useRouter } from 'next/navigation'

export default function AdminOrders() {
  const adminSegments = [
    { label: 'Menu', path: '/admin/menu' },
    { label: 'Orders', path: '/admin/orders' }
  ];
  const router = useRouter()

  return (
    <div className="pb-20">
      {/* Segmented Control Navigation */}
      <div className="mb-6">
        <SegmentedControl segments={adminSegments} />
      </div>
      
      <div className="pt-6">
          <button
            onClick={() => router.push('/admin/addorder')}
            type="submit"
            className="w-full bg-background-primary  text-typography-white  py-6 px-8 rounded-2xl text-lg font-bold"
          >
            Add Order
          </button>
        </div>
    </div>
  );
}


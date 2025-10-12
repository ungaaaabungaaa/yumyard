"use client";
import { SegmentedControl } from "@/components/ui/segmented-control";

export default function AdminOrders() {
  const adminSegments = [
    { label: 'Menu', path: '/admin/menu' },
    { label: 'Orders', path: '/admin/orders' }
  ];

  return (
    <div className="pb-20">
      {/* Segmented Control Navigation */}
      <div className="mb-6">
        <SegmentedControl segments={adminSegments} />
      </div>
      
      <h1>Orders</h1>
    </div>
  );
}


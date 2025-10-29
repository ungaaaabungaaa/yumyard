"use client"
import { SegmentedControl } from "@/components/ui/segmented-control";

const kitchenSegments = [
  { label: 'New Orders', path: '/kitchen' },
  { label: 'Out For Delivery', path: '/kitchen/outfordelivery' }
];


export default function OutForDelivery() {
  return(
    <>
     {/* Segmented Control Navigation */}
     <div className="mb-6">
     <SegmentedControl segments={kitchenSegments} />
   </div>
   </>

  );
}
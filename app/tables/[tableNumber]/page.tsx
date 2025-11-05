"use client";

import { useParams, useRouter } from 'next/navigation';

export default function TablePage() {
  const params = useParams();
  const router = useRouter();
  const tableNumber = params?.tableNumber as string || '';

  return (
    <>
    <div className='w-full min-h-full bg-background-surface-background flex flex-col items-center justify-center'>
    <div>Search Bar</div>
    <div>Cards</div>
    <div>Menu Items</div>
    </div>
    </>
  );
}

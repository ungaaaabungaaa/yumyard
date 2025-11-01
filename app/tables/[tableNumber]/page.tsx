"use client";

import { useParams, useRouter } from 'next/navigation';

export default function TablePage() {
  const params = useParams();
  const router = useRouter();
  const tableNumber = params?.tableNumber as string || '';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-typography-heading mb-2">
          Welcome to Table {tableNumber}
        </h2>
        <p className="text-lg text-typography-secondary mb-6">
          Browse our menu and place your order
        </p>
        <button
          onClick={() => router.push('/user/explore')}
          className="bg-background-primary text-white px-8 py-4 rounded-2xl text-lg font-bold transition-colors hover:bg-opacity-90"
        >
          View Menu
        </button>
      </div>
    </div>
  );
}

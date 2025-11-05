"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function TablesDetails() {
  const params = useParams();
  const router = useRouter();
  const tableNumber = params?.tableNumber as string;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (tableNumber) {
        router.push(`/tables/${tableNumber}`);
      }
    }, 2000); // Redirect after 2 seconds

    return () => clearTimeout(timer);
  }, [tableNumber, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-surface-background">
      <Spinner className="size-8 mb-4 text-typography-primary" />
      <h1 className="text-2xl font-semibold text-typography-heading">
        Oops! you are not supposed to be here
      </h1>
    </div>
  );
}

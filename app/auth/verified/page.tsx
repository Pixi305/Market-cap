"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function VerifiedPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push("/login"), 4000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-50">
            <CheckCircle size={36} className="text-success-600" />
          </div>
        </div>
        <h1 className="text-xl font-semibold text-neutral-900">Email verified!</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Your account is confirmed. Redirecting you to login…
        </p>
        <div className="mt-6">
          <Button intent="brand" className="w-full" onClick={() => router.push("/login")}>
            Go to login
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@banjoosa/ui";
import { useAuth } from "@/context/AuthContext";

/** Gates every authenticated route — see AuthContext.tsx for why this can't be done in middleware. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { admin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !admin) {
      router.replace("/login");
    }
  }, [loading, admin, router]);

  if (loading || !admin) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}

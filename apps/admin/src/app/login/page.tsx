"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, Card, Input } from "@banjoosa/ui";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/apiClient";

export default function LoginPage() {
  const { login, admin } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Redirecting must happen in an effect, not during render — otherwise
  // React warns about updating the router while LoginPage itself is rendering.
  useEffect(() => {
    if (admin) {
      router.replace("/");
    }
  }, [admin, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      router.replace("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not log in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Card shadow="sticker-lg" className="w-full max-w-[420px] p-8">
        <div className="flex flex-col items-center mb-6">
          <Image src="/brand/banjoosa-logo.png" alt="Banjoosa" width={56} height={56} />
          <div className="font-display text-2xl text-brand-red mt-2">BANJOOSA ADMIN</div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@banjoosa.test"
          />
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          {error && <p className="text-brand-red text-sm m-0">{error}</p>}
          <Button type="submit" variant="danger" fullWidth disabled={submitting}>
            {submitting ? "Logging in…" : "Log in"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

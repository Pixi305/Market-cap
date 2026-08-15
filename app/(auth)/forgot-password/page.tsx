import Link from "next/link";
import { sendPasswordReset } from "../actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Reset your password</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {message && (
        <p className="rounded-md bg-success-50 px-3 py-2 text-sm text-success-600">{message}</p>
      )}
      {error && (
        <p className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-600">{error}</p>
      )}

      <form action={sendPasswordReset} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-neutral-700">
            Email
          </label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <Button type="submit" intent="brand" className="w-full">
          Send reset link
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-500">
        Remember your password?{" "}
        <Link href="/login" className="font-medium text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

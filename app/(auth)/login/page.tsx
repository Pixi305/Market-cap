import Link from "next/link";
import { signIn } from "../actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/auth/PasswordInput";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; redirectTo?: string }>;
}) {
  const { error, message, redirectTo } = await searchParams;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Log in</h1>
        <p className="mt-1 text-sm text-neutral-500">Welcome back to Marketcap.</p>
      </div>

      {message && (
        <p className="rounded-md bg-success-50 px-3 py-2 text-sm text-success-600">{message}</p>
      )}
      {error && (
        <p className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-600">{error}</p>
      )}

      <form action={signIn} className="space-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo ?? "/"} />
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-neutral-700">
            Email
          </label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-neutral-700">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-brand-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput id="password" name="password" autoComplete="current-password" required />
        </div>
        <Button type="submit" intent="brand" className="w-full">
          Log in
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-500">
        No account?{" "}
        <Link href="/signup" className="font-medium text-brand-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

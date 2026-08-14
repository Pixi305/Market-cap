import Link from "next/link";
import { signUp } from "../actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Create your account</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Track live prices, news, and your portfolio.
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-600">{error}</p>
      )}

      <form action={signUp} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-neutral-700">
            Email
          </label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-neutral-700">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </div>
        <Button type="submit" intent="brand" className="w-full">
          Sign up
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

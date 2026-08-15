import { updatePassword } from "../actions";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/auth/PasswordInput";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Set new password</h1>
        <p className="mt-1 text-sm text-neutral-500">Choose a strong password for your account.</p>
      </div>

      {error && (
        <p className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-600">{error}</p>
      )}

      <form action={updatePassword} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-neutral-700">
            New password
          </label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </div>
        <Button type="submit" intent="brand" className="w-full">
          Update password
        </Button>
      </form>
    </div>
  );
}

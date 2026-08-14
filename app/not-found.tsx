import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-canvas text-center">
      <p className="text-lg font-medium text-neutral-900">Page not found</p>
      <Link href="/" className="text-sm font-medium text-brand-600 hover:underline">
        Back to dashboard
      </Link>
    </div>
  );
}

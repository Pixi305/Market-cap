export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
            M
          </div>
          <span className="text-lg font-semibold text-neutral-900">Marketcap</span>
        </div>
        <div className="rounded-xl bg-surface p-6 shadow-card">{children}</div>
      </div>
    </div>
  );
}

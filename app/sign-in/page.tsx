import { Suspense } from "react";
import SignInContent from "./SignInContent";

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInPageFallback />}>
      <SignInContent />
    </Suspense>
  );
}

function SignInPageFallback() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-12 md:px-10">
      <section className="w-full max-w-md rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/30">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
          Khosto Account
        </p>
        <h1 className="mt-2 text-3xl font-bold text-emerald-900 dark:text-emerald-100">Sign In</h1>
        <p className="mt-6 text-sm text-emerald-600 dark:text-emerald-400">Loading...</p>
      </section>
    </main>
  );
}

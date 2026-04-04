"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { saveStoredUser } from "../auth-storage";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    saveStoredUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    router.push("/sign-in?registered=1");
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-12 md:px-10">
      <section className="w-full max-w-md rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/30">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
          Khosto Account
        </p>
        <h1 className="mt-2 text-3xl font-bold text-emerald-900 dark:text-emerald-100">Sign Up</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-emerald-900 dark:text-emerald-100">Name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-900 outline-none transition focus:border-emerald-500 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-emerald-900 dark:text-emerald-100">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-900 outline-none transition focus:border-emerald-500 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-emerald-900 dark:text-emerald-100">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-900 outline-none transition focus:border-emerald-500 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-emerald-900 dark:text-emerald-100">Confirm Password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-900 outline-none transition focus:border-emerald-500 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
            />
          </label>

          {error && <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">{error}</p>}

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-full border border-yellow-300 bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-900 transition hover:bg-yellow-200 dark:border-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-200 dark:hover:bg-yellow-900/70"
          >
            Create Account
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-sm">
          <Link href="/" className="font-semibold text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100">
            Back to Home
          </Link>
          <Link href="/sign-in" className="font-semibold text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100">
            Already have an account?
          </Link>
        </div>
      </section>
    </main>
  );
}

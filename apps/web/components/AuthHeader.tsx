'use client';

import { useUser, SignInButton, UserButton } from '@clerk/nextjs';

export default function AuthHeader() {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null;
  return isSignedIn ? (
    <UserButton />
  ) : (
    <SignInButton mode="modal">
      <button className="rounded-lg border border-emerald-800 px-5 py-2 text-sm text-emerald-800 transition hover:bg-emerald-800 hover:text-white">
        Sign in
      </button>
    </SignInButton>
  );
}

'use client';

import { useUser, SignInButton, UserButton } from '@clerk/nextjs';

export default function AuthHeader() {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null;
  return isSignedIn ? (
    <UserButton />
  ) : (
    <SignInButton mode="modal">
      <button className="auth-btn">Sign in</button>
    </SignInButton>
  );
}

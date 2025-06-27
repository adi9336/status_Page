'use client';

import { UserButton, SignInButton, SignedOut, SignedIn } from "@clerk/nextjs";

export default function AuthButtons() {
  return (
    <div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
} 
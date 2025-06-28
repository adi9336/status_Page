'use client';

import { UserButton, SignInButton, SignedOut, SignedIn } from "@clerk/nextjs";

export default function AuthButtons() {
  return (
    <div className="flex items-center space-x-2 sm:space-x-4">
      <SignedOut>
        <SignInButton mode="modal">
          <button className="text-gray-700 hover:text-blue-600 px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors">
            Sign In
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  );
} 
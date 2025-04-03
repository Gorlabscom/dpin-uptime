"use client";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

// Create a separate client component for auth buttons
function AuthButtons() {
  return (
    <nav className="flex items-center gap-4">
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-500 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600">
            Sign up
          </button>
        </SignUpButton>
      </SignedOut>
    </nav>
  );
}

// Main Appbar can now be server component
export default function Appbar() {
  return (
    <div className="w-full bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <header>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Appbar</h1>
          </header>
          <AuthButtons />
        </div>
      </div>
    </div>
  );
}

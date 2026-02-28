"use client";

import { useState, useEffect } from "react";

const PASSWORD = "chog2025!";
const STORAGE_KEY = "breeze-dashboard-auth";

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem(STORAGE_KEY) === "true") {
      setAuthenticated(true);
    }
  }, []);

  // Prevent flash of content before hydration
  if (!mounted) return null;

  if (authenticated) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "true");
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setInput("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-breeze-dark">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 text-center"
      >
        <h1 className="text-2xl font-bold text-breeze-dark mb-1">
          CHOG Dashboard
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter the password to continue
        </p>

        <input
          type="password"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          autoFocus
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />

        {error && (
          <p className="text-red-500 text-sm mt-2">Incorrect password</p>
        )}

        <button
          type="submit"
          className="mt-4 w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Enter
        </button>

        <p className="text-xs text-gray-400 mt-4">Powered by Breeze AI</p>
      </form>
    </div>
  );
}

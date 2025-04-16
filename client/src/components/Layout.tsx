import Sidebar from "./Sidebar";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

import logo from "../assets/ChatGPT Image Apr 15, 2025, 06_21_23 PM.png"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-screen h-screen">
      <main className="flex-1 p-4 overflow-y-auto">
        {/* Top-left Home Button */}
        <Link
          to="/"
          className="inline-block mb-4 text-blue-600 font-semibold hover:underline"
        >
          <img
            src={logo}
            alt="Home"
            className="h-20 w-auto hover:opacity-80 transition-opacity duration-200"
          />
        </Link>

        {children}
      </main>
      <Sidebar />
    </div>
  );
}

import React from "react";
import { cn } from "../lib/utils";
import { Button } from "./Button";

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => (
  <header
    className={cn(
      "py-4 px-4 bg-white shadow flex items-center justify-between",
      className
    )}
  >
    <div className="flex items-center gap-8">
      <span className="text-2xl font-bold text-blue-700">Project AURA</span>
      <nav className="hidden md:flex gap-6">
        <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
          Home
        </a>
        <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
          Features
        </a>
        <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
          About
        </a>
        <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
          Contact
        </a>
      </nav>
    </div>
    <div className="flex gap-2">
      <Button variant="secondary">Login</Button>
      <Button variant="primary">Sign Up</Button>
    </div>
  </header>
);

"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircle } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out");
    router.push("/auth/login");
  };

  return (
    <nav className="w-full px-6 py-4 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 shadow-lg shadow-zinc-800/50 border-b border-zinc-700 text-white flex justify-between items-center">
      <div
        className="text-2xl font-bold tracking-wide cursor-pointer text-white drop-shadow-[0_1.2px_1.2px_rgba(255,255,255,0.2)]"
        onClick={() => router.push("/")}
      >
        TodoFlow
      </div>

      <div className="flex gap-4 items-center">
        {/* Show Login/Signup only on homepage if not logged in */}
        {!isLoggedIn && pathname === "/" && (
          <>
            <Button
              variant="outline"
              onClick={() => router.push("/auth/login")}
            >
              Login
            </Button>
            <Button onClick={() => router.push("/auth/register")}>
              Sign Up
            </Button>
          </>
        )}

        {isLoggedIn && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="p-0 rounded-full w-9 h-9 flex items-center justify-center"
              >
                <UserCircle className="w-9 h-9 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.2)]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white dark:bg-zinc-900 border border-zinc-700"
            >
              <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { FaGoogle } from "react-icons/fa";

import { signIn } from "next-auth/react";
import LoaderSpinner from "./LoaderSpinner";
import { signInWithGoogle } from "@/lib/auth.google.js";

export default function AuthForm({ type }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const isLogin = type === "login";

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!form.email || !form.password || (!isLogin && !form.name)) {
        return toast.error("Please fill in all required fields.");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        return toast.error("Enter a valid email.");
      }

      if (form.password.length < 6) {
        return toast.error("Password must be at least 6 characters.");
      }

      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : form;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.message || "Something went wrong");
      }

      toast.success(
        isLogin ? "Logged in successfully!" : "Registered successfully!"
      );

      if (isLogin) {
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        router.push("/auth/login");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full px-4 transition-all duration-200">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl">
        <CardContent className="p-8 space-y-6">
          <h2 className="text-3xl font-bold text-center">
            {isLogin ? "Login" : "Register"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name" className="mb-2">
                  Name
                </Label>
                <Input
                  name="name"
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="mb-2">
                Email
              </Label>
              <Input
                name="email"
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="mb-2">
                Password
              </Label>
              <Input
                name="password"
                id="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 font-medium px-4 py-2 rounded-md transition duration-200 ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <LoaderSpinner size={5} />
              ) : isLogin ? (
                "Login"
              ) : (
                "Sign Up"
              )}
            </Button>

            {/* <Button className="w-full" onClick={() => signIn("google")}>
              <span>
                <FaGoogle />
              </span>
              Continue with Google
            </Button> */}
            {/* <Button onClick={signInWithGoogle}>
              <span>
                <FaGoogle />
              </span>
              Continue with Google
            </Button> */}
            <div className="text-center text-sm text-muted-foreground pt-4">
              {isLogin ? (
                <>
                  Don’t have an account?{" "}
                  <span
                    className="text-primary cursor-pointer hover:underline"
                    onClick={() => router.push("/auth/register")}
                  >
                    Sign Up
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span
                    className="text-primary cursor-pointer hover:underline"
                    onClick={() => router.push("/auth/login")}
                  >
                    Login
                  </span>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

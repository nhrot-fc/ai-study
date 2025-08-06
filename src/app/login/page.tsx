"use client";

import React, { useState } from "react";
import { APP_TITLE, PAGE_TITLES, ROUTES } from "@/lib/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SiGithub, SiGoogle } from "@icons-pack/react-simple-icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Make real API call
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Login failed");
      }

      // Parse the callback URL from query params if it exists
      const searchParams = new URLSearchParams(window.location.search);
      const callbackUrl = searchParams.get("callbackUrl") || ROUTES.HOME;

      // After successful login, redirect
      router.push(decodeURIComponent(callbackUrl));
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gradient text-gradient-primary">
            {APP_TITLE}
          </h1>
          <p className="mt-3 text-muted-foreground">
            Sign in to continue to your learning journey
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-card/80 glow-primary">
          <CardHeader>
            <CardTitle className="text-2xl">{PAGE_TITLES.LOGIN}</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:glow-primary pulse-animation"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>

              <div className="flex items-center justify-center">
                <div className="text-xs text-muted-foreground">
                  Don{"'"}t have an account?{" "}
                  <Link
                    href="/register"
                    className="text-primary hover:text-primary/80"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="w-full">
                <SiGithub className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button variant="outline" className="w-full">
                <SiGoogle className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-center text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;

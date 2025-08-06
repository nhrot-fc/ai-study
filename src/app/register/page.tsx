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

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    full_name: "",
    password: "",
    confirmPassword: "",
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Here you would implement the registration API call
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     nickname: formData.nickname,
      //     email: formData.email,
      //     full_name: formData.full_name,
      //     password: formData.password
      //   })
      // });
      
      // if (!response.ok) {
      //   const data = await response.json();
      //   throw new Error(data.message || 'Registration failed');
      // }

      // Mock success - replace with actual API call
      setTimeout(() => {
        // After successful registration, redirect to login
        router.push(ROUTES.LOGIN);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
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
            Create a new account to start your learning journey
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-card/80 glow-primary">
          <CardHeader>
            <CardTitle className="text-2xl">Register</CardTitle>
            <CardDescription>
              Fill in your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input 
                  id="full_name" 
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="John Doe" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname">Nickname</Label>
                <Input 
                  id="nickname" 
                  value={formData.nickname}
                  onChange={handleChange}
                  placeholder="johndoe" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required 
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:glow-primary"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="flex items-center justify-center">
              <div className="text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link href={ROUTES.LOGIN} className="text-primary hover:text-primary/80">
                  Sign in
                </Link>
              </div>
            </div>

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
            By registering, you agree to our Terms of Service and Privacy Policy.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;

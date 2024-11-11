/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  if (!isLoaded) {
    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(err.errors[0].message);
    }
  }

  async function onPressVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(err.errors[0].message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg border border-gray-200">
        <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-t-lg text-white">
          <CardTitle className="text-2xl font-bold text-center">
            Sign Up for Todo Master
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {!pendingVerification ? (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-semibold">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="rounded-lg focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-semibold">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-lg focus:ring-2 focus:ring-pink-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <Alert variant="destructive" className="rounded-lg">
                  <AlertDescription className="text-red-600 font-medium">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-lg">
                Sign Up
              </Button>
            </form>
          ) : (
            <form onSubmit={onPressVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-gray-700 font-semibold">
                  Verification Code
                </Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter verification code"
                  className="rounded-lg focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive" className="rounded-lg">
                  <AlertDescription className="text-red-600 font-medium">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-lg">
                Verify Email
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="justify-center bg-gray-50 rounded-b-lg p-4">
          <p className="text-sm text-gray-700">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-purple-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

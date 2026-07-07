"use client";

import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLogin } from "@/hooks/useAuth";

import type { LoginRequest } from "@/types/auth";
import Card from "../ui/Card";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { loginSchema } from "@/schemas/login.schema";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const login = useLogin();

  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginRequest) => {
    login.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <Card className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-600">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to continue
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div>
            <Label>Email</Label>

            <Input
              type="email"
              placeholder="Enter your email"
              error={!!errors.email}
              {...register("email")}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label>Password</Label>

            <div className="relative">
              <Input
              type={ showPassword ? "text" : "password"}
              placeholder="Enter your password"
              error={!!errors.password}
              {...register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            </div>

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={login.isPending}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-slate-700 hover:underline"
          >
            Register
          </Link>
        </div>
      </Card>
    </div>
  );
}
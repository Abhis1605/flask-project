"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

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
import { Eye, EyeOff, AlertTriangle, Clock } from "lucide-react";

const AUTH_NOTICES = {
  login_required: {
    icon: AlertTriangle,
    message: "You have to login to access this route.",
    className:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  },
  session_expired: {
    icon: Clock,
    message: "Sorry, your session has expired. Please login first and then you can access that route.",
    className:
      "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  },
} as const;

type AuthNoticeReason = keyof typeof AUTH_NOTICES;

function isAuthNoticeReason(value: string | null): value is AuthNoticeReason {
  return value === "login_required" || value === "session_expired";
}

export default function LoginForm() {
  const searchParams = useSearchParams();

  const redirectParam = searchParams.get("redirect");
  // Only ever follow a same-site relative path — never an absolute/external URL.
  const redirectTo =
    redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")
      ? redirectParam
      : "/dashboard";

  const login = useLogin(redirectTo);

  const reasonParam = searchParams.get("reason");
  const authNotice = isAuthNoticeReason(reasonParam) ? AUTH_NOTICES[reasonParam] : null;

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
        {authNotice && (
          <div
            role="alert"
            className={`mb-6 flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${authNotice.className}`}
          >
            <authNotice.icon className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{authNotice.message}</span>
          </div>
        )}

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
"use client";

import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../ui/Button";

import { registerSchema, RegisterSchema } from "@/schemas/register.schema";

import { useRegister } from "@/hooks/useAuth";
import Card from "../ui/Card";
import Label from "../ui/Label";
import Input from "../ui/Input";
import { useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterForm() {
  const registerMutation = useRegister();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = ({ confirmPassword, ...data }: RegisterSchema) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-600">Create Account</h1>

          <p className="mt-2 text-sm text-slate-500">Register to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label>Full Name</Label>

            <Input
              placeholder="Enter your full name"
              error={!!errors.full_name}
              {...register("full_name")}
            />

            {errors.full_name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.full_name.message}
              </p>
            )}
          </div>

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
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                error={!!errors.password}
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showPassword ? 
                  <EyeOff className="h-5 w-5" />
                 :
                  <Eye className="h-5 w-5" />
                }
              </button>
            </div>

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Label>Confirm Password</Label>

            <div className="relative">
              <Input
              type={ showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              error={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
            >
              {
                showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" /> 
              }
            </button>
            </div>

            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={registerMutation.isPending}
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-slate-700 hover:underline"
          >
            Login
          </Link>
        </div>
      </Card>
    </div>
  );
}

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

export default function RegisterForm() {
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = ({
    confirmPassword,
    ...data
  }: RegisterSchema) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-600">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Register to continue
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
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

            <Input
              type="password"
              placeholder="Enter your password"
              error={!!errors.password}
              {...register("password")}
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Label>Confirm Password</Label>

            <Input
              type="password"
              placeholder="Confirm your password"
              error={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />

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

        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-slate-900 hover:underline"
          >
            Login
          </Link>
        </div>
      </Card>
    </div>
  );
}
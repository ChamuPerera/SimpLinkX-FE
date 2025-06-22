/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ResetPasswordFormValues } from "@/validations/reset-password";
import type { FC } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { resetPasswordSchema } from "@/validations/reset-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ImSpinner3 } from "react-icons/im";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

export const ResetPasswordPage: FC = () => {
  const { resetPassword, validateResetToken } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token || !email) {
      toast.error("Invalid reset link");
      return;
    }

    const { password: newPassword, password_confirmation: confirmPassword } =
      data;
    await resetPassword
      .mutateAsync({
        token,
        email,
        newPassword,
        confirmPassword,
      })
      .then(() => {
        toast.success("Password reset successful", {
          description: "You can now login with your new password",
        });
        form.reset();
        navigate("/login");
      })
      .catch((error) => {
        toast.error("Failed to reset password", {
          description: error.message || "Please try again later",
        });
      });
  };

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token || !email) {
        toast.error("Invalid reset link", {
          description: "The reset link is missing required information",
        });
        navigate("/login");
        return;
      }

      try {
        setIsValidating(true);
        await validateResetToken.mutateAsync({ token, email });
        setIsValidToken(true);
      } catch (error: unknown) {
        toast.error("Invalid or expired reset link", {
          description: "Please request a new password reset link",
        });
        navigate("/login");
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, email]);

  // set email with searchParam email changes
  useEffect(() => {
    if (email) form.setValue("email", email);
  }, [email, form]);

  // Show loading state while validating token
  if (isValidating) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <ImSpinner3 className="animate-spin mx-auto text-3xl text-blue-600 mb-4" />
          <p className="text-gray-600">Validating reset link...</p>
        </div>
      </main>
    );
  }

  // Don't render form if token is invalid
  if (!isValidToken) {
    return null;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 px-4">
      <div className="bg-white rounded-2xl shadow-2xl flex w-full max-w-2xl overflow-hidden">
        <div className="w-full p-8 space-y-6">
          {/* Brand: Logo + Name on the same line */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <img src="/logo.png" alt="logo" className="h-10 w-10" />
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SimpLinkX
            </span>
          </div>

          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-2xl font-bold text-blue-800">Reset Password</h1>
            <p className="text-gray-600 text-sm">
              Enter your new password below to reset your account password.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* New Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-700">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your new password"
                        className={`rounded-md bg-gray-100 focus:ring-2 ${
                          form.formState.errors.password
                            ? "ring-red-500"
                            : "ring-blue-300"
                        }`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600 text-sm" />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-700">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your new password"
                        className={`rounded-md bg-gray-100 focus:ring-2 ${
                          form.formState.errors.password_confirmation
                            ? "ring-red-500"
                            : "ring-blue-300"
                        }`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600 text-sm" />
                  </FormItem>
                )}
              />

              {/* Reset Password button */}
              <Button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold"
                disabled={resetPassword.isPending}
              >
                {resetPassword.isPending && (
                  <ImSpinner3 className="animate-spin mr-2 text-lg" />
                )}
                Reset Password
              </Button>

              {/* Back to login link */}
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Back to Login
                  </Link>
                </p>
              </div>
            </form>
          </Form>

          <footer className="text-center text-xs text-gray-500 mt-6">
            &copy; 2025 SimpLinkX. All rights reserved. | A Government of Sri
            Lanka Initiative
          </footer>
        </div>
      </div>
    </main>
  );
};

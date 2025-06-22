import type { ForgotPasswordFormValues } from "@/validations/forgot-password";
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
import { forgotPasswordSchema } from "@/validations/forgot-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ImSpinner3 } from "react-icons/im";
import { Link } from "react-router";
import { toast } from "sonner";

export const ForgotPasswordPage: FC = () => {
  const { forgotPassword } = useAuth();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    const { email } = data;
    await forgotPassword
      .mutateAsync({ email })
      .then(() => {
        toast.success("Reset link sent", {
          description:
            "Please check your email for password reset instructions",
        });
        form.reset();
      })
      .catch((error) => {
        toast.error("Failed to send reset link", {
          description: error.message || "Please try again later",
        });
      });
  };

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
            <h1 className="text-2xl font-bold text-blue-800">
              Forgot Password?
            </h1>
            <p className="text-gray-600 text-sm">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-700">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email address"
                        className={`rounded-md bg-gray-100 focus:ring-2 ${
                          form.formState.errors.email
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

              {/* Send Reset Link button */}
              <Button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold"
                disabled={forgotPassword.isPending}
              >
                {forgotPassword.isPending && (
                  <ImSpinner3 className="animate-spin mr-2 text-lg" />
                )}
                Send Reset Link
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

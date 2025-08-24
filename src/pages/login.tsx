import type { LoginFormValues } from "@/validations/login";

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
import { loginSchema } from "@/validations/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiError } from "react-icons/bi";
import { ImSpinner3 } from "react-icons/im";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";

export const LoginPage = () => {
  const { login } = useAuth();
  // get query params for redirect
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    const { email, password, rememberMe } = data;
    await login
      .mutateAsync({
        email,
        password,
        rememberMe,
        navigate: searchParams
          ? searchParams.get("redirect") || undefined
          : "/dashboard",
      })
      .then(() => {
        toast.success("Login successful", {
          description: new Date().toLocaleString(),
        });
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          return setError(
            error.response.data.message || "Invalid email or password",
          );
        }
        if (error.response?.status === 403) {
          return setError(
            error.response.data.message ||
              "You do not have permission to access this resource",
          );
        }
        toast.error("Login failed", {
          description: error.message || "Invalid email or password",
        });
      });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 px-4">
      <div className="bg-white rounded-2xl shadow-2xl flex w-full max-w-5xl overflow-hidden">
        {/* Left: Form Side */}
        <div className="w-full md:w-1/2 p-8 space-y-6">
          {/* Brand: Logo + Name on the same line */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Link to="/" className="flex items-center">
      <img src="/logo.png" alt="logo" className="h-15 w-15" />
      <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        SimpLinkX
      </span>
    </Link>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-700">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
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

              {/* Remember me + Forgot password */}
              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    {...form.register("rememberMe")}
                  />
                  <span className="text-blue-700">Remember Me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login button */}
              <Button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold"
                disabled={login.isPending}
              >
                {login.isPending && (
                  <ImSpinner3 className="animate-spin mr-2 text-lg" />
                )}
                Login
              </Button>

              {/* error message */}
              {error && (
                <div className="bg-red-500 px-3 py-2">
                  <p className="text-white text-sm flex justify-center items-center">
                    <BiError className="inline mr-1 size-5" />
                    {error}
                  </p>
                </div>
              )}

              {/* Signup link */}
              <p className="text-sm text-center text-gray-600">
                Don't you have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </Form>
          <footer className="text-center text-xs text-gray-500 mt-6">
            &copy; 2025 SimpLinkX. All rights reserved. | A Government of Sri
            Lanka Initiative
          </footer>
        </div>

        {/* Right: Image Side */}
        <div className="hidden md:block w-1/2">
          <img
            src="/images/login-img.jpeg"
            alt="Login Visual"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </main>
  );
};

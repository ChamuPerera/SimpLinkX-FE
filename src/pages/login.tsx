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
import { useForm } from "react-hook-form";
import { ImSpinner3 } from "react-icons/im";
import { Link } from "react-router";
import { toast } from "sonner";

export const LoginPage = () => {
  const { login } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    const { email, password } = data;
    await login
      .mutateAsync({ email, password })
      .then(() => {
        toast.success("Login successful", {
          description: new Date().toLocaleString(),
        });
      })
      .catch((error) => {
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
            <img src="/logo.png" alt="logo" className="h-10 w-10" />
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SimpLinkX
            </span>
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
                  <input type="checkbox" className="accent-blue-600" />
                  <span className="text-blue-700">Remember Me</span>
                </label>
                <Link to="/forgot" className="text-blue-600 hover:underline">
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

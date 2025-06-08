import type { LoginFormValues } from "@/validations/login";

import { Brand } from "@/components/custom";
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
    const email = data.email;
    const password = data.password;
    await login
      .mutateAsync({ email, password })
      .then(() => {
        toast.success("Login successful", {
          description: new Date().toLocaleString(),
        });
      })
      .catch((error) => {
        toast.error("Error occurred", {
          description: error.message || "Login Failed",
        });
      });
  };

  return (
    <main className="p-3 h-full min-h-screen flex flex-col">
      <div className="h-10">
        <Brand />
      </div>
      <div className="flex flex-col w-full justify-center items-center flex-1">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-xl space-y-6  border rounded-md  shadow-md drop-shadow-2xl p-4 md:p-6"
          >
            <div className="">
              <h1 className="text-2xl font-medium">Welcome back!</h1>
              {/* welcome note */}
              <p className="text-sm text-muted-foreground">
                Please enter your credentials.
              </p>
            </div>

            {/* email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="*********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={login.isPending} className="w-full">
              {login.isPending && <ImSpinner3 className="animate-spin" />}
              Sign in
            </Button>

            {/* register link */}
            <div className="flex justify-center text-sm">
              <span className="text-muted-foreground mr-2">
                Don't have an account?
              </span>
              <Link to={"/register"}>Register</Link>
            </div>
          </form>
        </Form>
      </div>

      {/* footer */}
      <footer className="text-center text-xs text-gray-600">
        <p>
          &copy; 2025 SimpLinkX. All rights reserved. | A Government of Sri
          Lanka Initiative
        </p>
      </footer>
    </main>
  );
};

import type { RegisterFormValues } from "@/validations/register";

import { Brand } from "@/components/custom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/utils";
import { registerSchema } from "@/validations/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiError } from "react-icons/bi";
import { ImSpinner3 } from "react-icons/im";
import { Link } from "react-router";
import { toast } from "sonner";

export const RegisterPage = () => {
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      nic: "",
      phone: "",
      date_of_birth: new Date(
        new Date().setFullYear(new Date().getFullYear() - 16),
      ),
      gender: "male",
      address: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const localMidnight = moment(data.date_of_birth).local().endOf("day");
    const utcDateString = moment(localMidnight).utc().format();
    data.date_of_birth = new Date(utcDateString);
    await register
      .mutateAsync(data)
      .then(() => {
        toast.success("Registration successful", {
          description: new Date().toLocaleString(),
        });
        form.reset();
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
        toast.error("Error occurred", {
          description: error.message || "Registration Failed",
        });
      });
  };

  return (
    <main className="relative min-h-screen py-10 flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-blue-100 via-white to-indigo-100 animate-gradient">
      {/* Background overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-100 via-white to-indigo-100 bg-[length:300%_300%] animate-gradient opacity-30"></div>

      <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 space-y-8">
        {/* Brand */}
        <div className="flex justify-center mb-4">
          <Brand />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Title */}
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-blue-800">
                Patient Registration
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Fill in the details below to create your account.
              </p>
            </div>

            {/* Section 1: Personal Info */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-blue-700">
                Part 1: Personal Information
              </h3>
              <hr className="border-blue-200" />
            </div>

            <div className="md:grid md:grid-cols-2 gap-6 space-y-6 md:space-y-0">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* NIC */}
              <FormField
                control={form.control}
                name="nic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      NIC <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="National Identity Card Number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="07XXXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date of Birth */}
              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Date of birth <span className="text-red-500">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          endMonth={
                            new Date(
                              new Date().setFullYear(
                                new Date().getFullYear() - 16,
                              ),
                            )
                          }
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date("1900-01-01") ||
                            date >
                              new Date(
                                new Date().setFullYear(
                                  new Date().getFullYear() - 16,
                                ),
                              )
                          }
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Gender <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Address <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Your address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Section 2: Password */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-blue-700">
                Part 2: Password
              </h3>
              <hr className="border-blue-200" />
              <p className="text-gray-500 text-sm">
                Password must contain at least 8 characters.
              </p>
            </div>

            <div className="md:grid md:grid-cols-2 gap-6 space-y-6 md:space-y-0">
              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Confirmation */}
              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Confirm Password <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={register.isPending}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3"
            >
              {register.isPending && (
                <ImSpinner3 className="animate-spin mr-2" />
              )}
              Register
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

            {/* Login Link */}
            <div className="flex justify-center text-sm">
              <span className="text-gray-600 mr-2">
                Already have an account?
              </span>
              <Link
                to={"/login"}
                className="text-blue-600 font-medium hover:underline"
              >
                Login
              </Link>
            </div>
          </form>
        </Form>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-500 mt-6">
          &copy; 2025 SimpLinkX. All rights reserved. | A Government of Sri
          Lanka Initiative
        </footer>
      </div>
    </main>
  );
};

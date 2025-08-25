import type { RegisterFormValues } from "@/validations/register";

import { api } from "@/services/api";
import Cookies from "js-cookie";

export const authServices = {
  // The login method is now async and returns a User object
  login: async (email: string, password: string, rememberMe: boolean) => {
    // send get request to /srf-cookie
    await api.get("/csrf-cookie");

    const { data } = await api.post("/login", { email, password, rememberMe });

    return data;
  },

  // The register method is now async and returns a User object
  register: async (data: RegisterFormValues) => {
    // send get request to /srf-cookie
    await api.get("/csrf-cookie");

    const { data: user } = await api.post("/register", data);

    return user;
  },

  // The logout method is now async and returns void
  logout: async () => {
    await api.post("/logout");
  },

  // The user method is now async and returns a User object
  getCurrentUser: async () => {
    // get auth key from cookie
    const cookie = Cookies.get("auth_token");

    // check if cookie is present
    if (!cookie) {
      throw new Error("No auth token found");
    }

    // add auth token to headers
    const { data } = await api.get("/user");

    return data?.user;
  },

  // The change password method is now async and returns void
  changePassword: async (
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) => {
    // get auth key from cookie
    const cookie = Cookies.get("auth_token");

    // check if cookie is present
    if (!cookie) {
      throw new Error("No auth token found");
    }

    await api.put("/user/password", {
      old_password: oldPassword,
      password: newPassword,
      password_confirmation: confirmPassword,
    });
  },

  // The change email method is now async and returns void
  changeEmail: async (email: string) => {
    // get auth key from cookie
    const cookie = Cookies.get("auth_token");

    // check if cookie is present
    if (!cookie) {
      throw new Error("No auth token found");
    }

    await api.put("/user/email", { email });
  },

  // The forgot password method is now async and returns void
  forgotPassword: async (email: string) => {
    // send get request to /srf-cookie
    await api.get("/csrf-cookie");

    await api.post("/forgot-password", { email });
  },

  // The validate reset token method is now async and returns void
  validateResetToken: async (token: string, email: string) => {
    // send get request to /srf-cookie
    await api.get("/csrf-cookie");

    const { data } = await api.post("/validate-reset-token", { token, email });
    return { valid: data.valid, email: data.email };
  },

  // The reset password method is now async and returns void
  resetPassword: async (
    token: string,
    email: string,
    password: string,
    password_confirmation: string,
  ) => {
    // send get request to /srf-cookie
    await api.get("/csrf-cookie");

    await api.post("/reset-password", {
      token,
      email,
      password,
      password_confirmation,
    });
  },
};

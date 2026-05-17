import api from "./axios";
import type { AuthResponse } from "../types";

export const loginApi = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/api/auth/login", { email, password });
  return res.data;
};

export const registerApi = async (
  name: string,
  email: string,
  password: string,
  role: "admin" | "sales"
): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/api/auth/register", {
    name,
    email,
    password,
    role,
  });
  return res.data;
};

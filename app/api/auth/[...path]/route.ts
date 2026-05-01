import { auth } from "@/lib/auth/server";

export const { GET, POST, DELETE, PATCH, PUT } = auth.handler();

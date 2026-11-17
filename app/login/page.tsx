import { LoginScreen } from "@/components/login-screen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to PTFlow, the coaching OS.",
};

export default function LoginPage() {
  return <LoginScreen />;
}

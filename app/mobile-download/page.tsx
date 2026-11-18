import { LoginScreen } from "@/components/login-screen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get the app",
  description:
    "Download the PTFlow app for iPhone or Android and sign in to your coach's plan.",
};

export default function MobileDownloadPage() {
  return <LoginScreen client />;
}

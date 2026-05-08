import type { Metadata } from "next";
import { AuthProvider } from "./_components/AuthContext";

export const metadata: Metadata = {
  title: "NativeVoice - Rewrite Professional Communications",
  description: "Help non-native English speakers rewrite professional communications with natural fluency",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

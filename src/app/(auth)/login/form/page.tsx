import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/forms/AuthForms";

export const metadata: Metadata = { title: "تسجيل الدخول" };

export default function Page() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

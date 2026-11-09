import type { Metadata } from "next";
import { Suspense } from "react";
import { ForgotForm } from "@/components/forms/AuthForms";

export const metadata: Metadata = { title: "نسيت كلمة المرور" };

export default function Page() {
  return (
    <Suspense>
      <ForgotForm />
    </Suspense>
  );
}

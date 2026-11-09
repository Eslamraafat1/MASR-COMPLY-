import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetForm } from "@/components/forms/AuthForms";

export const metadata: Metadata = { title: "إعادة تعيين كلمة المرور" };

export default function Page() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterWizard } from "@/components/forms/RegisterWizard";

export const metadata: Metadata = { title: "إنشاء حساب" };

export default function Page() {
  return (
    <Suspense>
      <RegisterWizard />
    </Suspense>
  );
}

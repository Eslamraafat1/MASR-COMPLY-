import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmail } from "@/components/forms/AuthForms";

export const metadata: Metadata = { title: "تأكيد البريد الإلكتروني" };

export default function Page() {
  return (
    <Suspense>
      <VerifyEmail />
    </Suspense>
  );
}

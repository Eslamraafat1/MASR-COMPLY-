"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";

const YES = [bi("المحتوى مناسب", "Relevant content"), bi("مكتوب بوضوح", "Well written"), bi("تصميم سهل", "Easy layout")];
const NO = [bi("المحتوى غير مناسب", "Not relevant"), bi("غير دقيق", "Inaccurate"), bi("طويل جداً", "Too long")];

/** Demo-only "was this page useful?" widget — nothing is sent anywhere. */
export function PageFeedback() {
  const { t } = useI18n();
  const [vote, setVote] = useState<"yes" | "no" | null>(null);
  const [done, setDone] = useState(false);
  return (
    <section className="border-t border-line bg-surface py-12">
      <div className="container-x max-w-2xl text-center">
        {done ? (
          <p role="status" className="font-semibold text-navy-900">
            {t(bi("شكراً لك! (محاكاة — لم يُرسل أي شيء)", "Thank you! (simulated — nothing was sent)"))}
          </p>
        ) : (
          <>
            <h2 className="text-lg font-bold text-navy-900">{t(bi("هل كانت هذه الصفحة مفيدة؟", "Was this page helpful?"))}</h2>
            <div className="mt-4 flex justify-center gap-3">
              <Button variant={vote === "yes" ? "primary" : "outline"} aria-pressed={vote === "yes"} onClick={() => setVote("yes")}>
                <ThumbsUp size={16} aria-hidden="true" /> {t(bi("نعم", "Yes"))}
              </Button>
              <Button variant={vote === "no" ? "primary" : "outline"} aria-pressed={vote === "no"} onClick={() => setVote("no")}>
                <ThumbsDown size={16} aria-hidden="true" /> {t(bi("لا", "No"))}
              </Button>
            </div>
            {vote && (
              <div className="mt-6 text-start">
                <fieldset className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
                  <legend className="sr-only">{t(bi("الأسباب", "Reasons"))}</legend>
                  {(vote === "yes" ? YES : NO).map((r) => (
                    <label key={r.en} className="flex items-center gap-2">
                      <input type="checkbox" className="size-4 accent-[#CE1126]" /> {t(r)}
                    </label>
                  ))}
                </fieldset>
                <label className="mt-4 block text-sm font-semibold text-navy-900">
                  {t(bi("تعليقك (اختياري)", "Your comment (optional)"))}
                  <textarea className="field mt-1.5 min-h-24 py-3 font-normal" />
                </label>
                <Button className="mt-4 w-full" onClick={() => setDone(true)}>
                  {t(bi("إرسال", "Submit"))}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { FormEvent, ReactNode } from "react";
import Button from "@/app/components/ui/Button";
import { HeaderAuth } from "@/app/components/ui/HeaderAuth";

type AuthField = {
  id: string;
  type: "text" | "email" | "password";
  placeholder: string;
  autoComplete: string;
};

type AuthFormCardProps = {
  title: string;
  description: string;
  submitLabel: string;
  fields: AuthField[];
  footerText: string;
  footerLinkText: string;
  footerHref: string;
  onSubmit?: (values: Record<string, string>) => void | Promise<void>;
  submitDisabled?: boolean;
  values?: Record<string, string>;
  onFieldChange?: (fieldId: string, value: string) => void;
  extraActions?: ReactNode;
};

export function AuthFormCard({
  title,
  description,
  submitLabel,
  fields,
  footerText,
  footerLinkText,
  footerHref,
  onSubmit,
  submitDisabled = false,
  values,
  onFieldChange,
  extraActions,
}: AuthFormCardProps) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!onSubmit) return;

    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries()) as Record<string, string>;
    await onSubmit(payload);
  }

  return (
    <div className="w-full max-w-md rounded-4xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800/50 dark:bg-black/40">
      <HeaderAuth title={title} description={description} />

      <form className="space-y-5" onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.id} className="flex flex-col">
            <input
              id={field.id}
              name={field.id}
              type={field.type}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              value={values ? values[field.id] ?? "" : undefined}
              onChange={
                onFieldChange
                  ? (event) => onFieldChange(field.id, event.target.value)
                  : undefined
              }
              className="w-full rounded-full border-3 border-pink-500 bg-gray-50 px-4 py-2 outline-none shadow-pink-500/50 focus:shadow-md focus:outline-pink-500 dark:bg-black dark:text-white"
              required
            />
          </div>
        ))}

        <div className="border-t border-gray-200 mt-5 pt-5">
          <Button
            type="submit"
            variant="secondary"
            disabled={submitDisabled}
            className="w-full justify-center rounded-full font-bold"
          >
            {submitLabel}
          </Button>

          {extraActions}
        </div>
      </form>

      <p className="mt-10 text-center text-gray-500 dark:text-gray-300">
        {footerText}{" "}
        <Link href={footerHref} className="font-semibold text-pink-500 hover:underline">
          {footerLinkText}
        </Link>
      </p>
    </div>
  );
}

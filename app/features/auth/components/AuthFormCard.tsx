import Link from "next/link";
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
};

export function AuthFormCard({
  title,
  description,
  submitLabel,
  fields,
  footerText,
  footerLinkText,
  footerHref,
}: AuthFormCardProps) {
  return (
    <div className="w-full max-w-md rounded-4xl border border-gray-200 bg-white px-5 py-6 shadow-sm dark:border-gray-800/50 dark:bg-black/40">
      <HeaderAuth title={title} description={description} />

      <form className="space-y-5">
        {fields.map((field) => (
          <div key={field.id} className="flex flex-col">
            <input
              id={field.id}
              name={field.id}
              type={field.type}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              className="w-full rounded-full border-3 border-pink-500 bg-gray-50 px-4 py-2 outline-none shadow-pink-500/50 focus:shadow-md focus:outline-pink-500 dark:bg-black dark:text-white"
              required
            />
          </div>
        ))}

        <div className="border-t border-gray-200 mt-5 pt-5">
          <Button
            type="submit"
            variant="secondary"
            className="w-full justify-center rounded-full text-base font-bold"
          >
            {submitLabel}
          </Button>
        </div>
      </form>

      <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-300">
        {footerText}{" "}
        <Link href={footerHref} className="font-semibold text-pink-500 hover:underline">
          {footerLinkText}
        </Link>
      </p>
    </div>
  );
}

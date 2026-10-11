import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import type { MessageKey } from "@/i18n/types";
import { LoginForm } from "./login-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("meta.login") };
}

/** Auth.js sends its errors here (pages.error), as ?error=CredentialsSignin, Configuration, AccessDenied… */
function errorKeyFor(error: string | string[] | undefined): MessageKey | null {
  const code = Array.isArray(error) ? error[0] : error;
  if (!code) return null;
  return code === "CredentialsSignin" ? "login.errors.invalid" : "login.errors.generic";
}

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { error } = await searchParams;
  return <LoginForm initialErrorKey={errorKeyFor(error)} />;
}

"use server";

import { redirect } from "next/navigation";

import { destroyBackofficeSession } from "@/lib/backoffice/auth";

export async function logoutBackofficeAction(): Promise<void> {
  await destroyBackofficeSession();
  redirect("/backoffice/login");
}

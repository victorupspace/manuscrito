import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import { PlatformShell } from "@/components/platform/platform-shell";
import { requireApprovedUser } from "@/lib/auth/require-approved-user";

export const metadata = {
  title: "Perfil — Manuscrito",
};

export const dynamic = "force-dynamic";

export default async function PlataformaPerfilPage() {
  const profile = await requireApprovedUser();

  return (
    <PlatformShell profile={profile}>
      <div className="mx-auto max-w-3xl space-y-6 py-6">
        <Link
          href="/plataforma"
          className="font-serif text-[0.9rem] text-brand-bordo underline-offset-4 hover:underline"
        >
          Voltar ao início
        </Link>

        <section className="rounded-lg border border-brand-bordo/10 bg-brand-creme/60 p-6">
          <p className="font-serif text-[0.7rem] uppercase tracking-[0.3em] text-brand-tinta/70">
            Perfil
          </p>
          <h1 className="mt-2 font-serif text-[2rem] italic text-brand-bordo">
            {profile.fullName}
          </h1>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            <Info label="Email" value={profile.email} />
            <Info label="Status da conta" value={profile.status} />
            <Info label="Plano" value={profile.plan ?? "free"} />
            <Info label="Identificador" value={profile.authUserId} />
          </dl>
          <div className="mt-6">
            <LogoutButton />
          </div>
        </section>
      </div>
    </PlatformShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-brand-bordo/10 bg-brand-marfim p-4">
      <dt className="font-serif text-[0.68rem] uppercase tracking-[0.24em] text-brand-tinta/70">
        {label}
      </dt>
      <dd className="mt-1 break-words font-serif text-[0.98rem] text-brand-carvao">
        {value}
      </dd>
    </div>
  );
}

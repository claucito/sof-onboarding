import Link from "next/link";

import { logout } from "@/app/actions/auth";
import { getSession } from "@/lib/auth";

export default async function AppNav() {
  const session = await getSession();
  if (!session) {
    return null;
  }

  return (
    <nav
      className="no-print"
      style={{
        marginBottom: "1.5rem",
        display: "flex",
        flexWrap: "wrap",
        gap: "0.75rem",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span className="meta" style={{ fontSize: "0.9rem" }}>
        Sesión: {session.email}
      </span>
      <div className="row" style={{ marginTop: 0 }}>
        <Link href="/">Inicio</Link>
        <Link href="/templates/new">Nueva plantilla</Link>
        <form action={logout}>
          <button type="submit" className="button secondary">
            Cerrar sesión
          </button>
        </form>
      </div>
    </nav>
  );
}

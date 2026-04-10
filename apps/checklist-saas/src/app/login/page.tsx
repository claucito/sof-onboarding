import Link from "next/link";

import { login } from "@/app/actions/auth";

type Props = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export default async function LoginPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const err = typeof sp.error === "string" ? sp.error : undefined;

  return (
    <>
      <h1>Iniciar sesión</h1>
      <p className="lead">Accede con el email y contraseña de tu cuenta (aislamiento por usuario).</p>

      {err === "missing" ? <p className="error">Completa email y contraseña.</p> : null}
      {err === "invalid" ? <p className="error">Credenciales incorrectas.</p> : null}

      <form action={login} className="card stack">
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        <div className="row">
          <button type="submit">Entrar</button>
          <Link className="button secondary" href="/register">
            Crear cuenta
          </Link>
        </div>
      </form>
    </>
  );
}

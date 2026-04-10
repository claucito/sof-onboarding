import Link from "next/link";

import { register } from "@/app/actions/auth";
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "@/lib/limits";

type Props = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export default async function RegisterPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const err = typeof sp.error === "string" ? sp.error : undefined;

  return (
    <>
      <h1>Crear cuenta</h1>
      <p className="lead">
        Modelo MVP: cuenta propia con email y contraseña (hash bcrypt). Magic link u OAuth quedan
        documentados como evolución en el README.
      </p>

      {err === "invalid-email" ? <p className="error">Email no válido.</p> : null}
      {err === "invalid-password" ? (
        <p className="error">
          La contraseña debe tener entre {MIN_PASSWORD_LENGTH} y {MAX_PASSWORD_LENGTH} caracteres.
        </p>
      ) : null}
      {err === "email-taken" ? <p className="error">Ese email ya está registrado.</p> : null}

      <form action={register} className="card stack">
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
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            maxLength={MAX_PASSWORD_LENGTH}
            required
          />
        </div>
        <div className="row">
          <button type="submit">Registrarme</button>
          <Link className="button secondary" href="/login">
            Ya tengo cuenta
          </Link>
        </div>
      </form>
    </>
  );
}

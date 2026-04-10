import {
  type CSSProperties,
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type Lead = {
  id: string;
  name: string;
  email: string;
  notes: string;
  created_at: string;
};

function useConfig() {
  return useMemo(() => {
    const base = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";
    const token = import.meta.env.VITE_DEMO_API_KEY ?? "";
    return { base, token, ready: base.length > 0 && token.length > 0 };
  }, []);
}

export function App() {
  const { base, token, ready } = useConfig();
  const [items, setItems] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }),
    [token],
  );

  const load = useCallback(async () => {
    if (!ready) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${base}/api/leads`, { headers: authHeaders });
      if (!res.ok) {
        throw new Error(`HTTP ${String(res.status)}`);
      }
      const data = (await res.json()) as { items: Lead[] };
      setItems(data.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [authHeaders, base, ready]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!ready) return;
    setError(null);
    const res = await fetch(`${base}/api/leads`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ name, email, notes }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? `HTTP ${String(res.status)}`);
      return;
    }
    setName("");
    setEmail("");
    setNotes("");
    await load();
  }

  async function onDelete(id: string) {
    if (!ready) return;
    setError(null);
    const res = await fetch(`${base}/api/leads/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok && res.status !== 204) {
      setError(`HTTP ${String(res.status)}`);
      return;
    }
    await load();
  }

  if (!ready) {
    return (
      <main style={styles.main}>
        <h1 style={styles.h1}>Panel demo</h1>
        <p>
          Configura <code>VITE_API_URL</code> y <code>VITE_DEMO_API_KEY</code> en <code>.env</code>{" "}
          (ver <code>.env.example</code>).
        </p>
      </main>
    );
  }

  return (
    <main style={styles.main}>
      <h1 style={styles.h1}>Leads (demo)</h1>
      <p style={styles.muted}>PoC interno — no usar claves reales en builds públicos.</p>

      {error ? <p style={styles.err}>{error}</p> : null}

      <section style={styles.card}>
        <h2 style={styles.h2}>Nuevo lead</h2>
        <form onSubmit={(e) => void onCreate(e)} style={styles.form}>
          <label style={styles.label}>
            Nombre
            <input
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              required
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Email
            <input
              type="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Notas
            <input
              value={notes}
              onChange={(ev) => setNotes(ev.target.value)}
              style={styles.input}
            />
          </label>
          <button type="submit" style={styles.button}>
            Crear
          </button>
        </form>
      </section>

      <section style={styles.card}>
        <div style={styles.row}>
          <h2 style={styles.h2}>Lista</h2>
          <button type="button" onClick={() => void load()} style={styles.buttonGhost}>
            {loading ? "…" : "Refrescar"}
          </button>
        </div>
        {items.length === 0 ? (
          <p style={styles.muted}>Sin registros. Crea uno o ejecuta seed en la API.</p>
        ) : (
          <ul style={styles.list}>
            {items.map((it) => (
              <li key={it.id} style={styles.li}>
                <div>
                  <strong>{it.name}</strong> — {it.email}
                  <div style={styles.muted}>{it.notes}</div>
                  <div style={styles.small}>{it.created_at}</div>
                </div>
                <button type="button" onClick={() => void onDelete(it.id)} style={styles.danger}>
                  Borrar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  main: { fontFamily: "system-ui, sans-serif", maxWidth: 640, margin: "0 auto", padding: 24 },
  h1: { fontSize: "1.5rem", marginBottom: 8 },
  h2: { fontSize: "1.1rem", margin: 0 },
  muted: { color: "#555", fontSize: "0.9rem" },
  err: { color: "#b00020" },
  card: {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  form: { display: "grid", gap: 12 },
  label: { display: "grid", gap: 4, fontSize: "0.9rem" },
  input: { padding: "8px 10px", borderRadius: 6, border: "1px solid #ccc" },
  button: {
    padding: "10px 14px",
    borderRadius: 6,
    border: "none",
    background: "#1a1a1a",
    color: "#fff",
    cursor: "pointer",
  },
  buttonGhost: {
    padding: "6px 10px",
    borderRadius: 6,
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
  },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  list: { listStyle: "none", padding: 0, margin: 0 },
  li: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    padding: "12px 0",
    borderBottom: "1px solid #eee",
  },
  small: { fontSize: "0.75rem", color: "#888" },
  danger: {
    alignSelf: "start",
    padding: "6px 10px",
    borderRadius: 6,
    border: "1px solid #b00020",
    background: "#fff",
    color: "#b00020",
    cursor: "pointer",
  },
};

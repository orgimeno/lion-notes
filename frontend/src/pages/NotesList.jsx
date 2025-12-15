import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function NotesList() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState(null);
  const [items, setItems] = useState([]);

  const canSearch = useMemo(() => q.trim().length >= 0, [q]);

  async function load() {
    setLoading(true);
    setErrMsg(null);
    try {
      const res = await api.listNotes(q.trim());
      setItems(res?.data?.items ?? []);
    } catch (e) {
      setErrMsg(e?.body ? JSON.stringify(e.body) : "Error cargando notas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onDelete(id) {
    if (!confirm("¿Borrar nota?")) return;
    try {
      await api.deleteNote(id);
      await load();
    } catch (e) {
      alert("Error borrando nota");
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1>Notas</h1>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por título..."
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={load} disabled={!canSearch || loading} style={{ padding: "10px 14px" }}>
          Buscar
        </button>
        <Link to="/new" style={{ padding: "10px 14px", border: "1px solid #ccc", borderRadius: 6, textDecoration: "none" }}>
          Nueva nota
        </Link>
      </div>

      {loading && <p style={{ marginTop: 16 }}>Cargando…</p>}
      {errMsg && <p style={{ marginTop: 16, color: "crimson" }}>{errMsg}</p>}

      {!loading && !errMsg && (
        <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
          {items.length === 0 && <p>No hay notas.</p>}

          {items.map((n) => (
            <div key={n.id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <strong>{n.title}</strong>
                  <div style={{ opacity: 0.7, fontSize: 12 }}>{n.created_at}</div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <Link to={`/edit/${n.id}`} style={{ padding: "6px 10px", border: "1px solid #ccc", borderRadius: 6, textDecoration: "none" }}>
                    Editar
                  </Link>
                  <button onClick={() => onDelete(n.id)} style={{ padding: "6px 10px" }}>
                    Borrar
                  </button>
                </div>
              </div>

              {n.content && <p style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>{n.content}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

function ArrowDown() {
  return <span aria-hidden="true">↓</span>;
}

function ArrowUp() {
  return <span aria-hidden="true">↑</span>;
}

export default function NotesList() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState(null);
  const [items, setItems] = useState([]);
  const [sort, setSort] = useState("desc");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 10 });

  const canSearch = useMemo(() => q.trim().length >= 0, [q]);

  async function load() {
    setLoading(true);
    setErrMsg(null);
    try {
      const res = await api.listNotes(q.trim(), sort, page);
      setItems(res?.data?.items ?? []);
      setMeta(res?.data?.meta ?? { current_page: 1, last_page: 1, total: 0, per_page: 10 });
    } catch (e) {
      setErrMsg(e?.body ? JSON.stringify(e.body) : "Error cargando notas");
    } finally {
      setLoading(false);
    }
  }

  async function onSearch() {
    setPage(1);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort]);

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

        <button onClick={() => { setPage(1); load(); }} disabled={!canSearch || loading} style={{ padding: "10px 14px" }}>
          Buscar
        </button>
        <Link to="/new" style={{ padding: "10px 14px", border: "1px solid #ccc", borderRadius: 6, textDecoration: "none" }}>
          Nueva nota
        </Link>
        <button
          onClick={() => { setPage(1); setSort((s) => (s === "desc" ? "asc" : "desc")); }}
          disabled={loading}
          title={sort === "desc" ? "Orden: nuevas primero" : "Orden: antiguas primero"}
          style={{ padding: "10px 14px" }}
        >
          {sort === "desc" ? <ArrowDown /> : <ArrowUp />}
        </button>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 10, alignItems: "center" }}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={loading || meta.current_page <= 1}
          style={{ padding: "8px 12px" }}
        >
          ←
        </button>

        <span style={{ opacity: 0.8 }}>
          Página {meta.current_page} / {meta.last_page} · Total: {meta.total}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(meta.last_page || 1, p + 1))}
          disabled={loading || meta.current_page >= meta.last_page}
          style={{ padding: "8px 12px" }}
        >
          →
        </button>
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

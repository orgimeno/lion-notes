import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../lib/api";

export default function NoteForm({ mode }) {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  useEffect(() => {
    if (mode !== "edit") return;

    (async () => {
      setLoading(true);
      setErrMsg(null);
      try {
        const res = await api.getNote(id);
        setTitle(res?.data?.title ?? "");
        setContent(res?.data?.content ?? "");
      } catch (e) {
        setErrMsg("No se pudo cargar la nota");
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, id]);

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setErrMsg(null);

    try {
      const payload = { title: title.trim(), content: content.trim() || null };

      if (!payload.title) {
        setErrMsg("El título es obligatorio");
        return;
      }

      if (mode === "edit") {
        await api.updateNote(id, payload);
      } else {
        await api.createNote(payload);
      }

      navigate("/");
    } catch (e) {
      const apiErrors = e?.body?.errors;
      if (apiErrors?.title?.length) setErrMsg(apiErrors.title[0]);
      else setErrMsg("Error guardando");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1>{mode === "edit" ? "Editar nota" : "Nueva nota"}</h1>

      <div style={{ marginBottom: 12 }}>
        <Link to="/">← Volver</Link>
      </div>

      {loading && <p>Cargando…</p>}
      {errMsg && <p style={{ color: "crimson" }}>{errMsg}</p>}

      {!loading && (
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
          <label>
            <div style={{ marginBottom: 6 }}>Título *</div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", padding: 10 }} />
          </label>

          <label>
            <div style={{ marginBottom: 6 }}>Contenido</div>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} style={{ width: "100%", padding: 10 }} />
          </label>

          <button disabled={saving} style={{ padding: "10px 14px" }}>
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </form>
      )}
    </div>
  );
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function request(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json", ...(options.headers || {}) },
        ...options,
    });

    const isJson = res.headers.get("content-type")?.includes("application/json");
    const body = isJson ? await res.json() : null;

    if (!res.ok) {
        const err = new Error("Request failed");
        err.status = res.status;
        err.body = body;
        throw err;
    }

    return body;
}

export const api = {
    listNotes: (q = "", sort = "desc", page = 1) =>
        request(
            `/api/notes?q=${encodeURIComponent(q)}&sort=${encodeURIComponent(sort)}&page=${encodeURIComponent(page)}`
        ),
    getNote: (id) => request(`/api/notes/${id}`),
    createNote: (payload) => request(`/api/notes`, { method: "POST", body: JSON.stringify(payload) }),
    updateNote: (id, payload) => request(`/api/notes/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    deleteNote: (id) => request(`/api/notes/${id}`, { method: "DELETE" }),
};

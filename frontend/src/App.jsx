import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotesList from "./pages/NotesList";
import NoteForm from "./pages/NoteForm";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NotesList />} />
        <Route path="/new" element={<NoteForm mode="create" />} />
        <Route path="/edit/:id" element={<NoteForm mode="edit" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

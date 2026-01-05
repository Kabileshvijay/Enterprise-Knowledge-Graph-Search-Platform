import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import "../../styles/user/editDocument.css";

const EditDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    content: "",
    status: "DRAFT",
    tags: "",
  });

  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  /* ================= TIPTAP ================= */
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: "",
    onUpdate: ({ editor }) => {
      setForm((prev) => ({
        ...prev,
        content: editor.getHTML(),
      }));
    },
  });

  /* ================= FETCH DOCUMENT ================= */
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/documents/${id}`, {
          credentials: "include",
        });

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        if (res.status === 403) {
          alert("You are not allowed to edit this document");
          navigate("/profile");
          return;
        }

        const data = await res.json();

        setForm({
          title: data.title,
          category: data.category,
          content: data.content,
          status: data.status,
          tags: data.tags || "",
        });

        editor?.commands.setContent(data.content);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id, editor, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= UPDATE DOCUMENT ================= */
  const handleUpdate = async () => {
    const res = await fetch(`${API_BASE_URL}/api/documents/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()),
      }),
    });

    if (res.status === 401) {
      navigate("/login");
      return;
    }

    if (res.status === 403) {
      alert("You are not allowed to update this document");
      return;
    }

    alert("Document updated successfully");
    navigate("/profile");
  };

  if (loading) return <p>Loading document...</p>;

  return (
    <div className="edit-page">
      {/* 🔙 BACK BUTTON */}
      <button className="edit-back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2>Edit Document</h2>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        className="edit-input"
      />

      {/* TOOLBAR */}
      <div className="editor-toolbar">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>
          B
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>
          I
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()}>
          U
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • List
        </button>
      </div>

      {/* EDITOR */}
      <div className="editor-box">
        <EditorContent editor={editor} />
      </div>

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="edit-select"
      >
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
      </select>

      {/* TAGS */}
      <input
        name="tags"
        value={form.tags}
        onChange={handleChange}
        placeholder="tags (comma separated)"
        className="edit-input"
      />

      <button className="update-btn" onClick={handleUpdate}>
        Update
      </button>
    </div>
  );
};

export default EditDocument;

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import "../styles/createDocument.css";

const DEFAULT_TAGS = [
  "documentation",
  "knowledge-base",
  "enterprise",
  "search",
  "knowledge-graph",
  "data",
  "backend",
  "architecture",
  "system-design",
  "api",
  "database",
  "graph",
  "search-engine",
  "metadata",
  "indexing",
  "performance",
  "scalability",
  "best-practices",
  "how-to",
  "tutorial",
];

const CreateDocument = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // FORM STATES
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  // AUTHOR 
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");

  // TAG STATES
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const [isPreview, setIsPreview] = useState(false);

  // 🔹 IMAGE MODAL STATES
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  /* ================= LOAD LOGGED-IN USER ================= */
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/employees/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => {
        setAuthorName(data.name);
        setAuthorEmail(data.email);
      })
      .catch(() => navigate("/"));
  }, [API_BASE_URL, navigate]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
    ],
    content: "<p>Write your documentation here...</p>",
  });

  /* ================= TAG LOGIC ================= */

  const handleInputChange = (e) => {
    const value = e.target.value;
    setTagInput(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = DEFAULT_TAGS.filter(
      (tag) =>
        tag.toLowerCase().includes(value.toLowerCase()) && !tags.includes(tag)
    );

    setSuggestions(filtered);
  };

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  /* ================= IMAGE INSERT ================= */

  const addImage = () => {
    setShowImageModal(true);
  };

  const insertImageByUrl = () => {
    if (!editor) return;

    if (!imageUrl.startsWith("http")) {
      alert("Please enter a valid image URL");
      return;
    }

    editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl("");
    setShowImageModal(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result }).run();
    };
    reader.readAsDataURL(file);

    e.target.value = "";
    setShowImageModal(false);
  };

  /* ================= SUBMIT DOCUMENT ================= */

  const submitDocument = async (status) => {
    if (!editor) return;

    if (!title || !category) {
      alert("Title and Category are required");
      return;
    }

    const payload = {
      title,
      category,
      tags,
      content: editor.getHTML(),
      status,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/documents`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed");

      alert(
        status === "PUBLISHED"
          ? "Document published successfully"
          : "Draft saved successfully"
      );

      navigate("/home");
    } catch (error) {
      console.error(error);
      alert("Error saving document");
    }
  };

  return (
    <div className="create-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/home")}>
          ← Back
        </button>
        <h1>Create Knowledge Document</h1>
      </div>

      <form className="create-form">
        <div className="form-group">
          <label>Document Title</label>
          <input
            type="text"
            placeholder="Enter document title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Author Name</label>
            <input type="text" value={authorName} disabled />
          </div>

          <div className="form-group">
            <label>Author Email</label>
            <input type="email" value={authorEmail} disabled />
          </div>
        </div>

        <div className="form-group">
          <label>Category / Space</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select space</option>
            <option value="Engineering">Engineering</option>
            <option value="Analytics">Analytics</option>
            <option value="Architecture">Architecture</option>
            <option value="Runbooks">Runbooks</option>
          </select>
        </div>

        {/* TAG INPUT */}
        <div className="form-group">
          <label>Tags</label>
          <div className="tags-input">
            {tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
                <button type="button" onClick={() => removeTag(tag)}>
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Type tag and press Enter"
              value={tagInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          {suggestions.length > 0 && (
            <div className="tag-suggestions">
              {suggestions.map((tag) => (
                <div
                  key={tag}
                  className="tag-suggestion"
                  onClick={() => addTag(tag)}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CONTENT EDITOR */}
        <div className="form-group">
          <label>Content</label>

          <div className="editor-toolbar">
            <button type="button" onClick={() => setIsPreview(false)}>
              Write
            </button>
            <button type="button" onClick={() => setIsPreview(true)}>
              Preview
            </button>

            {!isPreview && (
              <>
                <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}>
                  B
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}>
                  I
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()}>
                  U
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>
                  • List
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
                  {"</>"}
                </button>
                <button type="button" onClick={addImage}>
                  Image
                </button>
              </>
            )}
          </div>

          <EditorContent editor={editor} className="editor-content" />
        </div>

        {/* IMAGE MODAL */}
        {showImageModal && (
          <div className="image-modal-overlay">
            <div className="image-modal">
              <h3>Insert Image</h3>

              <input
                type="text"
                placeholder="Paste image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />

              <div className="image-modal-actions">
                <button type="button" onClick={insertImageByUrl}>
                  Insert via URL
                </button>

                <button type="button" onClick={() => fileInputRef.current.click()}>
                  Upload from device
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowImageModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HIDDEN IMAGE INPUT */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />

        <div className="form-actions">
          <button
            type="button"
            className="primary-btn"
            onClick={() => submitDocument("PUBLISHED")}
          >
            Publish
          </button>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => submitDocument("DRAFT")}
          >
            Save Draft
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDocument;

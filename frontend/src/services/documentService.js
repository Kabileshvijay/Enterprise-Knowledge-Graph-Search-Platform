// ✅ BASE URL
const BASE_URL = "http://localhost:8080/api/documents";

/* ================= GET ALL DOCUMENTS ================= */
export const getAllDocuments = async () => {
  const res = await fetch(BASE_URL, {
    credentials: "include"
  });

  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
};

/* ================= SEARCH DOCUMENTS ================= */
export const searchDocuments = async (keyword) => {
  const res = await fetch(
    `${BASE_URL}/search?keyword=${encodeURIComponent(keyword)}`,
    {
      credentials: "include"
    }
  );

  if (!res.ok) throw new Error("Search failed");
  return res.json();
};

/* ================= GET DOCUMENT BY ID ================= */
export const getDocumentById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    credentials: "include"
  });

  if (!res.ok) throw new Error("Document not found");
  return res.json();
};

/* ================= LIKE DOCUMENT ================= */
export const likeDocument = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/like`, {
    method: "PUT",
    credentials: "include"
  });

  if (!res.ok) throw new Error("Like failed");
  return res.json();
};

/* ================= SAVE / UNSAVE DOCUMENT ================= */
export const saveDocument = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/save`, {
    method: "PUT",
    credentials: "include"
  });

  if (!res.ok) throw new Error("Save failed");
};

/* ================= GET SAVED DOCUMENTS ================= */
export const getSavedDocuments = async () => {
  const res = await fetch(`${BASE_URL}/saved`, {
    credentials: "include"
  });

  if (!res.ok) throw new Error("Failed to fetch saved documents");
  return res.json();
};

/* ================= CHECK IF DOCUMENT IS SAVED ================= */
export const checkIfSaved = async (id) => {
  const res = await fetch(`${BASE_URL}/saved`, {
    credentials: "include"
  });

  if (!res.ok) return false;

  const docs = await res.json();
  return docs.some((d) => d.id === Number(id));
};

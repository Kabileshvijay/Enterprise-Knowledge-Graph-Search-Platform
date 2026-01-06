// ✅ BASE URL
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

/* ================= GET ALL PEOPLE ================= */
export const getAllPeople = async () => {
  const res = await fetch(`${BASE_URL}/people`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch people");
  return res.json();
};

/* ================= GET PERSON BY ID ================= */
export const getPersonById = async (id) => {
  const res = await fetch(`${BASE_URL}/people/${id}`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Person not found");
  return res.json();
};

/* ================= GET DOCUMENTS BY AUTHOR ================= */
export const getDocumentsByAuthor = async (authorEmail) => {
  const res = await fetch(
    `${BASE_URL}/documents/search?author=${encodeURIComponent(authorEmail)}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
};

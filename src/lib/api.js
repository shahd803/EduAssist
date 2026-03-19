const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");

const buildUrl = (endpoint) => {
  const normalizedEndpoint = String(endpoint || "").startsWith("/")
    ? String(endpoint || "")
    : `/${String(endpoint || "")}`;

  return `${BASE_URL}${normalizedEndpoint}`;
};

// ===== TOKEN MANAGEMENT =====
export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const setToken = (token) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
};

// ===== GENERIC FETCH WRAPPER =====
async function apiFetch(endpoint, options = {}) {
  const { skipAuth = false, ...requestOptions } = options;
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(requestOptions.headers || {}),
  };

  if (token && !skipAuth) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(endpoint), {
    ...requestOptions,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "API Error");
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

async function parseErrorResponse(response) {
  const data = await response.json().catch(() => null);
  return data?.message || data?.error || `API Error (${response.status})`;
}

// ======================================
// AUTH
// ======================================

export const signup = (data) =>
  apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const login = async (data) => {
  const response = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (response.token) {
    setToken(response.token);
  }

  return response;
};

export const forgotPassword = (email) =>
  apiFetch("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const resetPassword = (token, newPassword) =>
  apiFetch("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });

// ======================================
// USER
// ======================================

export const getMe = () => apiFetch("/me");

// ======================================
// MATERIALS
// ======================================

export const createMaterial = (data) =>
  apiFetch("/materials", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const uploadMaterial = async (file, title) => {
  const formData = new FormData();
  formData.append("title", title || file?.name || "Untitled");
  formData.append("file", file);
  const token = getToken();
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl("/materials/upload"), {
    method: "POST",
    body: formData,
    headers,
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  return response.json();
};

export const getMaterials = () => apiFetch("/materials");

export const getMaterialById = (id) => apiFetch(`/materials/${id}`);

export const deleteMaterial = (id) =>
  apiFetch(`/materials/${id}`, {
    method: "DELETE",
  });

// ======================================
// QUIZZES
// ======================================

export const generateQuiz = (materialId, data) =>
  apiFetch(`/materials/${materialId}/generate-quiz`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const refineQuiz = () =>
  apiFetch("/quiz/refine", {
    method: "POST",
  });

export const saveQuiz = (data) =>
  apiFetch("/quizzes", {
    method: "POST",
    body: JSON.stringify(data),
  });

// Reserved for the backend-owned export flow once the Spring endpoint is live.
export const exportQuiz = (quizId) =>
  apiFetch(`/quizzes/${quizId}/export`, {
    method: "POST",
  });

export const getQuizzes = () => apiFetch("/quizzes");

export const getQuizById = (id) => apiFetch(`/quizzes/${id}`);

export const deleteQuiz = (id) =>
  apiFetch(`/quizzes/${id}`, {
    method: "DELETE",
  });

// ======================================
// HEALTH
// ======================================

export const checkHealth = () => apiFetch("/health");


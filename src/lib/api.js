const BASE_URL = "http://localhost:8080/api";

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
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "API Error");
  }

  return response.json();
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

export const getMaterials = () => apiFetch("/materials");

export const getMaterialById = (id) => apiFetch(`/materials/${id}`);

export const deleteMaterial = (id) =>
  apiFetch(`/materials/${id}`, {
    method: "DELETE",
  });

// ======================================
// QUIZZES
// ======================================

export const generateQuiz = (data) =>
  apiFetch("/quizzes/generate", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const saveQuiz = (data) =>
  apiFetch("/quizzes", {
    method: "POST",
    body: JSON.stringify(data),
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

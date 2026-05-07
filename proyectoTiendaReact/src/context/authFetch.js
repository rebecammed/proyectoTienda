const API_URL = "https://proyectotienda-m8um.onrender.com/api";

export const authFetch = (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      ...options.headers,
    },
  });
};

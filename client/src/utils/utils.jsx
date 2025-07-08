import { jwtDecode } from "jwt-decode"; 


export const getToken = () => {
  return localStorage.getItem("token");
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    return Date.now() >= decoded.exp * 1000;
  } catch (err) {
    return true;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

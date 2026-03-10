import { createContext, useMemo, useState } from "react";

export const AuthContext = createContext(null);

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const user = useMemo(() => {
    if (!token) return null;

    const decoded = parseJwt(token);
    if (!decoded) return null;

    return {
      _id: decoded.user,
      id: decoded.user,
      tokenPayload: decoded,
    };
  }, [token]);

  function saveToken(newToken) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

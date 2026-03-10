import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { saveToken } = useContext(AuthContext);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/users/signin", { email, password });
      const token = res?.data?.token || res?.data?.data?.token;

      if (!token) {
        alert("Token not found");
        return;
      }

      saveToken(token);
      navigate("/home");
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-wrap">
      <div className="form-container card">
        <h2 className="page-title">Login</h2>

        <form className="app-form" onSubmit={handleLogin}>
          <input
            className="form-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="form-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn form-submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="form-switch">
          New user? <Link to="/register">Create account</Link>
        </p>
      </div>
    </section>
  );
}

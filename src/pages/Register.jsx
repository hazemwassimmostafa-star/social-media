import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rePassword: "",
    dateOfBirth: "",
    gender: "male",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/users/signup", formData);
      alert("Account created ✅");
      navigate("/login");
    } catch (err) {
      alert(err?.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-wrap">
      <div className="form-container card">
        <h2 className="page-title">Register</h2>

        <form className="app-form" onSubmit={handleRegister}>
          <input className="form-input" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input className="form-input" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input className="form-input" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input className="form-input" name="rePassword" type="password" placeholder="Confirm Password" value={formData.rePassword} onChange={handleChange} required />
          <input className="form-input" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />

          <select className="form-input" name="gender" value={formData.gender} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <button type="submit" className="btn form-submit" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="form-switch">
          Have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}

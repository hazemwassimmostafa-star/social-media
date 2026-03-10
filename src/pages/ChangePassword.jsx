import { useState } from "react";
import api from "../services/api";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitVariant(payload) {
    return api.patch("/users/change-password", payload);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (newPassword !== confirm) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    const attempts = [
      { oldPassword, password: newPassword, newPassword, rePassword: confirm },
      { oldPassword, password: newPassword, rePassword: confirm },
      { oldPassword, newPassword },
      { oldPassword, password: newPassword },
    ];

    try {
      let lastError = null;

      for (const payload of attempts) {
        try {
          const res = await submitVariant(payload);
          alert(res?.data?.message || "Password changed successfully ✅");
          setOldPassword("");
          setNewPassword("");
          setConfirm("");
          return;
        } catch (err) {
          lastError = err;
        }
      }

      throw lastError;
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-wrap">
      <div className="form-container card">
        <h2 className="page-title">Change Password</h2>

        <form className="app-form" onSubmit={handleSubmit}>
          <input
            className="form-input"
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />

          <input
            className="form-input"
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <input
            className="form-input"
            type="password"
            placeholder="Confirm New Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button type="submit" className="btn form-submit" disabled={loading}>
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </section>
  );
}

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function getLinkClass(path) {
    return location.pathname === path ? "nav-link active" : "nav-link";
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to={token ? "/home" : "/login"} className="brand-link">
          Social App
        </Link>

        <div className="nav-links">
          {token ? (
            <>
              <Link to="/home" className={getLinkClass("/home")}>
                Home
              </Link>
              <Link to="/profile" className={getLinkClass("/profile")}>
                Profile
              </Link>
              <Link to="/change-password" className={getLinkClass("/change-password")}>
                Change Password
              </Link>
              <button type="button" className="btn btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={getLinkClass("/login")}>
                Login
              </Link>
              <Link to="/register" className={getLinkClass("/register")}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

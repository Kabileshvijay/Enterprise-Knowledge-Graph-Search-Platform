import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.css";
import loginImage from "../../assets/login.png";

const Login = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      /* 1️⃣ LOGIN (SETS COOKIE) */
      const loginRes = await fetch(
        `${API_BASE_URL}/api/employees/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // 🔴 REQUIRED
          body: JSON.stringify({ email, password }),
        }
      );

      if (!loginRes.ok) {
        throw new Error("LOGIN_FAILED");
      }

      /* 2️⃣ FETCH LOGGED-IN USER */
      const meRes = await fetch(
        `${API_BASE_URL}/api/employees/me`,
        { credentials: "include" } // 🔴 REQUIRED
      );

      if (!meRes.ok) {
        throw new Error("AUTH_FAILED");
      }

      const user = await meRes.json();

      /* 3️⃣ ROLE-BASED REDIRECT */
      if (user.role === "ROLE_ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }

    } catch (error) {
      alert(
        "Invalid credentials or you are not authorised. Please contact admin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h2 className="logo">EntroGraph</h2>
        <img
          src={loginImage}
          alt="Login Illustration"
          className="login-image"
        />
      </div>

      <div className="login-right">
        <h2 className="login-title">USER LOGIN</h2>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <span className="icon">👤</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <span className="icon">🔒</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

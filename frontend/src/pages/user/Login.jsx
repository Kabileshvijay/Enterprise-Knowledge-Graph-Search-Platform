import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/user/Login.css";
import loginImage from "../../assets/login.png";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    /* 🔹 ADMIN LOGIN (FRONTEND ONLY) */
    if (email === "admin@gmail.com" && password === "123") {
      localStorage.setItem("role", "ADMIN");
      navigate("/admin");
      return;
    }

    /* 🔹 EMPLOYEE LOGIN */
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/employees/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("LOGIN_FAILED");
      }

      const employee = await response.json();

      localStorage.setItem("role", "EMPLOYEE");
      localStorage.setItem("employeeName", employee.name);
      localStorage.setItem("employeeEmail", employee.email);

      navigate("/home");
    } catch (error) {
      alert(
        "You are not an employee of the organisation. Please contact admin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Section */}
      <div className="login-left">
        <h2 className="logo">EntroGraph</h2>
        <img
          src={loginImage}
          alt="Login Illustration"
          className="login-image"
        />
      </div>

      {/* Right Section */}
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

          <div className="options">
            <label>
              <input type="checkbox" /> Remember
            </label>
            <a href="#">Forgot password?</a>
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

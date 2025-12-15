import React from "react";
import "../styles/Login.css";
import loginImage from "../assets/login.png";

const Login = () => {
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

        <form className="login-form">
          <div className="input-group">
            <span className="icon">👤</span>
            <input
              type="text"
              placeholder="Username"
              required
            />
          </div>

          <div className="input-group">
            <span className="icon">🔒</span>
            <input
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <div className="options">
            <label>
              <input type="checkbox" /> Remember
            </label>
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" className="login-btn">
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

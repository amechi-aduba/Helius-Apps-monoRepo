// src/pages/login/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      // Replace fakeLoginApi with your real login call if you have one
      await fakeLoginApi(email, password);

      // On success, store a flag in localStorage so PrivateRoute will pass
      localStorage.setItem("token", "true");

      // Redirect to home
      navigate("/", { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || "Login failed.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <h1>
          Welcome to
          <br />
          Helius Health
        </h1>
      </div>
      <div className="login-right">
        <div className="login-box">
          <h2>Sign In</h2>
          {errorMsg && <p className="error">{errorMsg}</p>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="login-options">
              <a href="#" onClick={(e) => e.preventDefault()}>
                Forgot Password?
              </a>
            </div>

            <button type="submit">Login</button>
          </form>

          <p className="signup">
            Need an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/create");
              }}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

/**
 * Temporary stub for authentication.
 * Replace this with your real API call.
 */
function fakeLoginApi(email: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email.trim() && password.trim()) {
        resolve();
      } else {
        reject(new Error("Please enter both email and password."));
      }
    }, 500);
  });
}

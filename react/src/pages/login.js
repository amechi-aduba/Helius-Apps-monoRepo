import React, { useState } from "react";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [pswdforget, setPswdforget] = useState(false);
  const [resetConfirmed, setResetConfirmed] = useState(false);
  const [acctCreate, setAcctCreate] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

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
          {pswdforget ? (
            resetConfirmed ? (
              <div className="resetpswd">
                <h2>Forgot Password</h2>
                <p>
                  We’ve sent a password reset link to your email
                  <br />
                  <strong>{email}</strong>
                </p>
                <button type="button">Continue</button>
                <button
                  type="button"
                  onClick={() => {
                    setPswdforget(false);
                    setResetConfirmed(false);
                    setEmail("");
                  }}
                >
                  Back to Sign In
                </button>
                <p className="resend">
                  Didn’t receive the mail? <a href="#">Click to resend</a>
                </p>
              </div>
            ) : (
              <div className="resetpswd">
                <h2>Reset Password</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setResetConfirmed(true);
                  }}
                >
                  <label htmlFor="email">E-mail</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit">Reset Password</button>
                  <button type="button" onClick={() => setPswdforget(false)}>
                    Back
                  </button>
                </form>
              </div>
            )
          ) : (
            <>
              <h2>Sign in</h2>
              <form>
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                />
                <div className="login-options">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPswdforget(true);
                    }}
                  >
                    Forgot Password?
                  </a>
                </div>
                <button type="submit">Login</button>
              </form>
              <p className="signup">
                Need an Account?{" "}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

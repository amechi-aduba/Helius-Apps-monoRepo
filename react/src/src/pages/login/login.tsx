import React, { useState } from "react";
import "../../styles/login.css";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [pswdforget, setPswdforget] = useState<boolean>(false);
  const [resetConfirmed, setResetConfirmed] = useState<boolean>(false);
  const [acctCreate, setAcctCreate] = useState<boolean>(false); // not currently used
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Login logic
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
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
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
              <form onSubmit={handleSubmit}>
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

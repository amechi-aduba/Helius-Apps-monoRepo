import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/createacct.css";

const checkRules = (pwd) => ({
  min8: pwd.length >= 8,
  hasNumber: /\d/.test(pwd),
  hasSpecial: /[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]/.test(pwd),
});

const RuleItem = ({ ok, text }) => (
  <li className="rule">
    <input
      type="checkbox"
      checked={ok} /* auto-check */
      readOnly /* user can’t toggle */
      className="rule-box"
    />
    <span className={ok ? "rule-text ok" : "rule-text"}>{text}</span>
  </li>
);

const CreateAcctPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPswd] = useState("");
  const rules = checkRules(password);
  const [agreed, setAgreed] = useState(location.state?.accepted || false);

  const allValid = rules.min8 && rules.hasNumber && rules.hasSpecial;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!allValid) return;
  };

  return (
    <div className="createacct-wrapper">
      {/* left side (form) */}
      <div className="createacct-left">
        <div className="createacct-box">
          <h2>Create Account</h2>

          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

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
              value={password}
              placeholder="Enter a password"
              onChange={(e) => setPswd(e.target.value)}
              required
            />
            {/* password rules */}
            <ul className="password-rules">
              <RuleItem ok={rules.min8} text="At least 8 characters" />
              <RuleItem ok={rules.hasSpecial} text="A special character" />
              <RuleItem ok={rules.hasNumber} text="A number" />
            </ul>

            {/* terms row */}
            <div className="terms-row">
              {/* non-toggleable checkbox */}
              <input
                type="checkbox"
                className={`terms-click ${agreed ? "accepted" : ""}`}
                checked={agreed}
                onClick={(e) => e.preventDefault()} // block user toggle
              />

              {/* link to open the legal page */}
              <label htmlFor="terms">
                I agree to the{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("termsandconditions");
                  }}
                >
                  Terms&nbsp;&amp;&nbsp;Conditions
                </a>
              </label>
            </div>

            <button type="submit">Create Account</button>
          </form>

          <p className="signin">
            Already have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/"); // back to login
              }}
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
      {/* right side (branding) */}
      <div className="createacct-right">
        <h1>
          Welcome to
          <br />
          Helius Health
        </h1>
      </div>
    </div>
  );
};

export default CreateAcctPage;

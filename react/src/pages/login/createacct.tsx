import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/createacct.css";

type RuleCheck = {
  min8: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
};

const checkRules = (pwd: string): RuleCheck => ({
  min8: pwd.length >= 8,
  hasNumber: /\d/.test(pwd),
  hasSpecial: /[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]/.test(pwd),
});

type RuleItemProps = {
  ok: boolean;
  text: string;
};

const RuleItem: React.FC<RuleItemProps> = ({ ok, text }) => (
  <li className="rule">
    <input type="checkbox" checked={ok} readOnly className="rule-box" />
    <span className={ok ? "rule-text ok" : "rule-text"}>{text}</span>
  </li>
);

const CreateAcctPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPswd] = useState<string>("");
  const [agreed, setAgreed] = useState<boolean>(
    location.state?.accepted || false
  );

  const rules = checkRules(password);
  const allValid = rules.min8 && rules.hasNumber && rules.hasSpecial;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!allValid) return;
    // Submit logic
  };

  return (
    <div className="createacct-wrapper">
      <div className="createacct-left">
        <div className="createacct-box">
          <h2>Create Account</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
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
            <ul className="password-rules">
              <RuleItem ok={rules.min8} text="At least 8 characters" />
              <RuleItem ok={rules.hasSpecial} text="A special character" />
              <RuleItem ok={rules.hasNumber} text="A number" />
            </ul>
            <div className="terms-row">
              <input
                type="checkbox"
                className={`terms-click ${agreed ? "accepted" : ""}`}
                checked={agreed}
                onClick={(e) => e.preventDefault()}
              />
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
                navigate("/");
              }}
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
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

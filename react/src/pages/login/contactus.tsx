import "../../styles/contactus.css";
import React, { useState } from "react";

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleBack = () => {
    setSubmitted(false);
  };

  return (
    <div className="contactus-wrapper">
      <div className="contactus-left">
        <h1>
          Welcome to
          <br />
          Helius Health
        </h1>
      </div>
      <div className="contactus-right">
        <div className="contactus-box">
          <h2>Contact Us</h2>
          {submitted ? (
            <div className="confirmationbox">
              <p>
                We’ll get back to you as soon as possible!
                <br />
                Check your e-mail to see if you received anything from us.
              </p>
              <p>
                <strong>-Helius Health Team</strong>
              </p>
              <button onClick={handleBack}>Ok</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                required
              />
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                required
              />
              <label htmlFor="message">Message</label>
              <textarea
                className="message-box"
                id="message"
                placeholder="Send us a message!"
                required
              />
              <button type="submit">Send</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

import "../styles/contactus.css";
import React, { useState } from "react";

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: send form data to backend here
    setSubmitted(true); // show confirmation
  };

  const handleBack = () => {
    setSubmitted(false); // return to form if needed
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
            <form>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="Enter your name" />
              <label htmlFor="email">E-mail</label>
              <input type="email" id="email" placeholder="Enter your email" />

              <label htmlFor="message">Message</label>
              <textarea
                className="message-box"
                id="message"
                placeholder="Send us a message!"
              />

              <button onClick={handleSubmit} type="submit">
                Send
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

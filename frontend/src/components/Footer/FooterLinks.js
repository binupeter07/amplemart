import React from "react";
import { useNavigate } from "react-router-dom"; // Importing useNavigate from react-router-dom
import "./FooterLinks.scss";

const FooterLinks = () => {
  const navigate = useNavigate(); // Defining navigate using useNavigate hook

  return (
    <footer className="footer-section">
      <div className="container contact">
        <h2>Let's Connect</h2>
        <button className="btn btn-dark" onClick={() => navigate("/contact")}>
          Contact Us
        </button>
      </div>
    </footer>
  );
};

export default FooterLinks;

import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">© 2024 FELGTBI+ – Todos los derechos reservados</p>
        <div className="footer-icons">
          <a href="https://x.com/FELGTBI" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://www.instagram.com/felgtbi/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.facebook.com/FELGTBI" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="https://www.youtube.com/channel/UCI1f5B0GhLizU-7jhU-KOYQ" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-youtube"></i>
          </a>
          <a href="https://www.linkedin.com/company/felgtbi/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
        <button
          className="footer-button"
          onClick={() => window.location.href = 'https://felgtbichatbot.netlify.app/'}
        >
          Chatbot
        </button>
      </div>
    </footer>
  );
};

export default Footer;

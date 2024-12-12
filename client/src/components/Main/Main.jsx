import React, { useState } from "react";
import Chatbot from "./chatbot/Chatbot";
import ChatbotSanitario from "./ChatbotSanitario/ChatbotSanitario";
// import ChatbotLLM from "./ChatbotLLM/ChatbotLLM";

const Main = () => {
  const [isProfesional, setIsProfesional] = useState(null);

  const handleUserClick = () => setIsProfesional(false);
  const handleProfesionalClick = () => setIsProfesional(true);

  return (
    <div>
      {isProfesional === null && (
        <div className="main-selection-container">
          <p>Por favor, elige si eres un Usuario o un Profesional.</p>
          <div className="card-group">
            <div onClick={handleUserClick} className="card">
              <img src="/usuario.jpg" alt="Soy Usuario" className="card-image" />
              <p className="card-text">Soy Usuario</p>
            </div>
            <div onClick={handleProfesionalClick} className="card">
              <img src="/profesional.jpg" alt="Soy Profesional" className="card-image" />
              <p className="card-text">Soy Profesional</p>
            </div>
          </div>
        </div>
      )}

      {isProfesional !== null && (
        isProfesional ? <ChatbotSanitario /> : <Chatbot />
      )}
    </div>
  );

};

export default Main;

import React, { useState } from "react";
import Chatbot from "./chatbot/Chatbot";
import ChatbotSanitario from "./ChatbotSanitario/ChatbotSanitario";
import ChatbotLLM from "./ChatbotLLM/ChatbotLLM";

const Main = () => {
  const [isProfesional, setIsProfesional] = useState(null);

  const handleUserClick = () => setIsProfesional(false);
  const handleProfesionalClick = () => setIsProfesional(true);

  return (
    <div>
      {isProfesional === null && (
        <div className="main-selection-container">
          <p>Por favor, elige si eres un Usuario o un Profesional.</p>
          <div className="button-group">
            <button onClick={handleUserClick}>Soy Usuario</button>
            <button onClick={handleProfesionalClick}>Soy Profesional</button>
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

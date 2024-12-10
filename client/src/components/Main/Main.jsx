import React, { useState } from "react";
import Chatbot from "./chatbot/Chatbot";
import ChatbotSanitario from "./ChatbotSanitario/ChatbotSanitario";
import ChatbotLLM from "./ChatbotLLM/ChatbotLLM";

const Main = () => {
  const [isProfesional, setIsProfesional] = useState(null); // Estado para determinar si es profesional o usuario

  const handleUserClick = () => {
    setIsProfesional(false); // Cuando elige usuario, muestra Chatbot
  };

  const handleProfesionalClick = () => {
    setIsProfesional(true); // Cuando elige profesional, muestra ChatbotSanitario
  };

  return <>
    <ChatbotLLM/>
    </>
    // <>
    // <div>
    //   {/* Solo mostrar los botones si no se ha hecho una selección */}
    //   {isProfesional === null && (
    //     <div>
    //       <button onClick={handleUserClick}>Soy Usuario</button>
    //       <button onClick={handleProfesionalClick}>Soy Profesional</button>
    //     </div>
    //   )}

    //   {/* Mostrar el componente correspondiente según la selección */}
    //   {isProfesional === null ? (
    //     <p>Por favor, elige si eres un Usuario o un Profesional.</p>
    //   ) : isProfesional ? (
    //     <ChatbotSanitario /> // Muestra ChatbotSanitario si es Profesional
    //   ) : (
    //     <Chatbot /> // Muestra Chatbot si es Usuario
    //   )}
    // </div>
    // </>
};

export default Main;

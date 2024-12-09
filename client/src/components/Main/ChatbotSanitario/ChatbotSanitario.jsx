import React, { useState } from "react";
import "../../../styles/components/_ChatbotSanitario.scss"; 

const initialData = {
  municipio_residencia: "",
  ccaa: "", 
  ambito_laboral: "",
  especialidad: "",
  vih_usuario: "",
  vih_diagnostico: "No tengo", 
  vih_tratamiento: "No tengo", 
  ha_tratado_vih: "",
  como_conocio_felgtbi: "", 
};

function ChatbotSanitario() {
  const [formData, setFormData] = useState(initialData);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const steps = [
    {
      key: "municipio_residencia",
      question: "¿En qué municipio resides?",
      validate: (value) => value.trim().length > 0,
      errorMessage: "Por favor, ingresa tu municipio de residencia.",
    },
    {
      key: "ccaa", 
      question: "¿En qué comunidad autónoma resides?",
      validate: (value) => value.trim().length > 0,
      errorMessage: "Por favor, ingresa tu comunidad autónoma.",
    },
    {
      key: "ambito_laboral",
      question: "¿En qué ámbito laboral trabajas?",
      validate: (value) => value.trim().length > 0,
      errorMessage: "Por favor, ingresa tu ámbito laboral.",
    },
    {
      key: "especialidad",
      question: "¿Cuál es tu especialidad?",
      validate: (value) => value.trim().length > 0,
      errorMessage: "Por favor, ingresa tu especialidad.",
    },
    {
      key: "vih_usuario",
      question: "¿El paciente tiene vih?",
      validate: (value) => ["si", "no", "no sabe / no contesta"].includes(value.toLowerCase()),
      errorMessage: "Por favor, selecciona una respuesta.",
    },
    {
      key: "ha_tratado_vih",
      question: "¿Has tratado anteriormente con personas con VIH?",
      validate: (value) => ["si", "no"].includes(value.toLowerCase()),
      errorMessage: "Por favor, responde con 'Sí' o 'No'.",
    },
    {
      key: "como_conocio_felgtbi",
      question: "¿Cómo has conocido a la FELGTBI+?",
      validate: (value) => value.trim().length > 0,
      errorMessage: "Por favor, ingresa cómo conociste la FELGTBI+.",
    },
  ];

  const currentQuestion = steps[currentStep];

  const handleSubmit = () => {
    if (currentQuestion.validate(inputValue)) {
      setFormData((prevData) => ({
        ...prevData,
        [currentQuestion.key]: inputValue,
      }));
      setInputValue("");
      setError("");

      if (currentStep < steps.length - 1) {
        setCurrentStep((prevStep) => prevStep + 1);
      } else {
        console.log("Formulario Completado:", formData);
      }
    } else {
      setError(currentQuestion.errorMessage);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-history">
        {steps.slice(0, currentStep).map((step, index) => (
          <div key={index} className="chatbot-history-item">
            <div className="chat-message question">{step.question}</div>
            <div className="chat-message answer">{formData[step.key]}</div>
          </div>
        ))}
      </div>

      {currentStep < steps.length ? (
        <div>
          <h2 className="chatbot-question">{currentQuestion.question}</h2>
          <div className="chat-input">
            <input
              type="text"
              className="chatbot-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
            <button className="chatbot-submit" onClick={handleSubmit}>
              Enviar
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </div>
      ) : (
        <div>
          <h2 className="chatbot-complete-message">¡Formulario completo!</h2>
        </div>
      )}
    </div>
  );
}

export default ChatbotSanitario;

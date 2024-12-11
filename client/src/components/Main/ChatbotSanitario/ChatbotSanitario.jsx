import React, { useState, useEffect, useRef } from "react";
import "../../../styles/components/_ChatbotSanitario.scss";
import ChatbotLLM from "../ChatbotLLM/ChatbotLLM";
import { useNavigate } from "react-router-dom";

const initialData = {
  id_sesion: "",
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
  const [datosFormulario, setdatosFormulario] = useState("");
  const [LLM, setLLM] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const chatHistoryRef = useRef(null);
  const lastMessageRef = useRef(null);

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
      validate: (value) => ["si", "no", "No sabe / No contesta"].includes(value.toLowerCase()),
      errorMessage: "Por favor, selecciona una respuesta.",
    },
    {
      key: "vih_diagnostico",
      question: "¿Cuándo recibiste el diagnóstico de vih? ejemplo: entre 1 y 3 meses o mas de un año",
      options: ["Menos de un mes", "Entre 1 y 3 meses", "Entre 3 y 12 meses", "Más de un año"],
      validate: (value) => ["menos de un mes", "entre 1 y 3 meses", "entre 3 y 12 meses", "más de un año"].includes(value.toLowerCase()),
      errorMessage: "Por favor, selecciona una opción válida.",
      conditional: (formData) => formData.vih_usuario.toLowerCase() === "si",
    },
    {
      key: "vih_tratamiento",
      question: "¿Desde cuándo recibes tratamiento para el vih? ejemplo: entre 1 y 3 meses o mas de un año",
      options: ["Menos de un mes", "Entre 1 y 3 meses", "Entre 3 y 12 meses", "Más de un año"],
      validate: (value) => ["menos de un mes", "entre 1 y 3 meses", "entre 3 y 12 meses", "más de un año"].includes(value.toLowerCase()),
      errorMessage: "Por favor, selecciona una opción válida.",
      conditional: (formData) => formData.vih_usuario.toLowerCase() === "sí",
    },
    {
      key: "ha_tratado_vih",
      question: "¿Has tratado anteriormente con personas con vih?", // Se cambió de 'pro_vih_profesional' a 'ha_tratado_vih'
      validate: (value) => ["si", "no"].includes(value.toLowerCase()),
      errorMessage: "Por favor, responde con 'Sí' o 'No'.",
    },
    {
      key: "como_conocio_felgtbi",
      question: "¿Cómo has conocido a la FELGTBI+?", // Se cambió de 'conocer_felgtbi' a 'como_conocio_felgtbi'
      validate: (value) => value.trim().length > 0,
      errorMessage: "Por favor, ingresa cómo conociste la FELGTBI+.",
    },
  ];
  const currentQuestion = steps[currentStep];

  const handleConditionalSkip = (value) => {
    if (currentQuestion.key === "vih_usuario") {
      if (value.toLowerCase() === "no") {
        setCurrentStep(steps.findIndex((step) => step.key === "ha_tratado_vih"));
        return true;
      }
    }
    if (currentQuestion.key === "vih_tratamiento" && formData.vih_usuario.toLowerCase() === "si") {
      if (value.toLowerCase() === "no") {
        setCurrentStep(steps.findIndex((step) => step.key === "ha_tratado_vih"));
        return true;
      }
    }
    return false;
  };

  const handleSubmit = async () => {
    if (currentQuestion.validate(inputValue)) {
      const updatedValue = currentQuestion.key === "edad" ? Number(inputValue) : inputValue;
      setFormData({ ...formData, [currentQuestion.key]: updatedValue });
      setInputValue("");
      setError("");

      if (!handleConditionalSkip(inputValue)) {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          setCurrentStep(steps.length);
        }
      }
    } else {
      setError(currentQuestion.errorMessage);
    }
  };
  const sendForm = async () => {
    const sessionId = formData.id_sesion || "sesion_predeterminada";

    setLLM(true);

    const updatedFormData = {
      ...formData,
      id_sesion: sessionId,
      vih_diagnostico: formData.vih_diagnostico || "No tengo", // Valor predeterminado
      vih_tratamiento: formData.vih_tratamiento || "No tengo", // Valor predeterminado
    };

    const missingFields = Object.keys(updatedFormData).filter(
      (key) => key !== "vih_tratamiento" && key !== "vih_diagnostico" && !updatedFormData[key].trim()
    );

    if (missingFields.length > 0) {
      alert(`Faltan campos obligatorios: ${missingFields.join(", ")}`);
      return;
    }

    try {
      const response = await fetch("http://52.214.54.221:8000/respuesta-profesional", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Detalles del error:", errorData);
        alert("Error al enviar el formulario. Por favor, inténtalo de nuevo.");
      } else {
        console.log("Datos enviados correctamente:", updatedFormData);
        alert("¡Formulario enviado exitosamente!");
        setdatosFormulario(updatedFormData);
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Hubo un error al enviar los datos: " + error.message);
    }
  };

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      id_sesion: "sesion_" + Date.now(),
    }));
  }, []);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentStep]);


  return (
    <div className="chatbot-container">
      <div className="chatbot-history" ref={chatHistoryRef}>
        {steps.slice(0, currentStep).map((step, index) =>
          step.conditional && !step.conditional(formData) ? null : (
            <div
              key={index}
              className="chatbot-history-item"
              ref={index === currentStep - 1 ? lastMessageRef : null}
            >
              <div className="chat-message question">{step.question}</div>
              <div className="chat-message answer">{formData[step.key]}</div>
            </div>
          )
        )}
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
      ) : ( <>
        <>
          <h2 className="chatbot-complete-message">¡Formulario completo!</h2>
          <button onClick={sendForm}>Enviar respuestas</button>
          { LLM ? <ChatbotLLM data={datosFormulario}/> : ""}
        </>
        </> )}
    </div>
  );
}

export default ChatbotSanitario;

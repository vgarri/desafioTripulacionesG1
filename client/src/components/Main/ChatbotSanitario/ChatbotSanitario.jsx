import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../../../styles/components/_ChatbotSanitario.scss";
//import ChatbotLLM from "../ChatbotLLM/ChatbotLLM";
import { useNavigate } from "react-router-dom";
//import ChatbotLLM2 from "../ChatbotLLM2/ChatbotLLM2";


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
  const [formData, setFormData] = useState(initialData);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [formSent, setFormSent] = useState(false);
  const [LLMmessage, setLLMmessage] = useState("");
  const [isLLMLoading, setIsLLMLoading] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
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
      validate: (value) =>
        ["si", "no", "No sabe / No contesta"].includes(value.toLowerCase()),
      errorMessage: "Por favor, selecciona una respuesta.",
    },
    {
      key: "vih_diagnostico",
      question: "¿Cuándo recibiste el diagnóstico de vih?",
      options: [
        "Menos de un mes",
        "Entre 1 y 3 meses",
        "Entre 3 y 12 meses",
        "Más de un año",
      ],
      validate: (value) =>
        [
          "menos de un mes",
          "entre 1 y 3 meses",
          "entre 3 y 12 meses",
          "más de un año",
        ].includes(value.toLowerCase()),
      errorMessage: "Por favor, selecciona una opción válida.",
      conditional: (formData) => formData.vih_usuario.toLowerCase() === "si",
    },
    {
      key: "vih_tratamiento",
      question: "¿Desde cuándo recibes tratamiento para el vih?",
      options: [
        "Menos de un mes",
        "Entre 1 y 3 meses",
        "Entre 3 y 12 meses",
        "Más de un año",
      ],
      validate: (value) =>
        [
          "menos de un mes",
          "entre 1 y 3 meses",
          "entre 3 y 12 meses",
          "más de un año",
        ].includes(value.toLowerCase()),
      errorMessage: "Por favor, selecciona una opción válida.",
      conditional: (formData) => formData.vih_usuario.toLowerCase() === "si",
    },
    {
      key: "ha_tratado_vih",
      question: "¿Has tratado anteriormente con personas con vih?",
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

  const handleConditionalSkip = (value) => {
    if (currentQuestion.key === "vih_usuario" && value.toLowerCase() === "no") {
      setCurrentStep(steps.findIndex((step) => step.key === "ha_tratado_vih"));
      return true;
    }
    return false;
  };

  const handleSubmit = () => {
    if (currentQuestion.validate(inputValue)) {
      setFormData((prevData) => ({
        ...prevData,
        [currentQuestion.key]: inputValue,
      }));
      setInputValue("");
      setError("");

      if (!handleConditionalSkip(inputValue)) {
        if (currentStep < steps.length - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          setFormSent(true);
        }
      }
    } else {
      setError(currentQuestion.errorMessage);
    }
  };

  const sendForm = async () => {
    const updatedFormData = {
      ...formData,
      id_sesion: formData.id_sesion || `sesion_${Date.now()}`,
    };

    try {
      const response = await fetch(
        "http://52.214.54.221:8000/respuesta-profesional",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Detalles del error:", errorData);
        alert("Error al enviar el formulario. Por favor, inténtalo de nuevo.");
      } else {
        console.log("Datos enviados correctamente:", updatedFormData);
        alert("¡Formulario enviado exitosamente!");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Hubo un error al enviar los datos: " + error.message);
    }
  };

  const sendLLMRequest = async () => {
    sendForm();

    const url = "http://52.214.54.221:8000/chatbot_profesional";
    const dataForLLM = {
      pregunta_profesional: userQuestion || "Sin pregunta específica",
      municipio: formData.municipio_residencia || "N/A",
      ccaa: formData.ccaa || "N/A",
      conocer_felgtbi: formData.como_conocio_felgtbi || "N/A",
      vih_usuario: formData.vih_usuario || "N/A",
      vih_diagnostico: formData.vih_diagnostico || "N/A",
      vih_tratamiento: formData.vih_tratamiento || "N/A",
      pro_ambito: formData.ambito_laboral || "N/A",
      pro_especialidad: formData.especialidad || "N/A",
      pro_vih_profesional: formData.ha_tratado_vih || "N/A",
    };

    setChatHistory((prevHistory) => [
      ...prevHistory,
      { type: "user", message: userQuestion || "Sin pregunta específica" },
    ]);

    setIsLLMLoading(true);
    try {
      const response = await axios.post(url, dataForLLM, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        setLLMmessage(response.data.respuesta_chat);
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { type: "bot", message: response.data.respuesta_chat },
        ]);
      }
    } catch (error) {
      console.error("Error en la interacción con el LLM:", error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { type: "bot", message: "Hubo un error al procesar tu solicitud." },
      ]);
    } finally {
      setIsLLMLoading(false);
    }
  };

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      id_sesion: `sesion_${Date.now()}`,
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
        {steps.slice(0, currentStep).map((step, index) => (
          (!step.conditional || step.conditional(formData)) && (
            <div
              key={index}
              className="chatbot-history-item"
              ref={index === currentStep - 1 ? lastMessageRef : null}
            >
              <div className="chat-message question">{step.question}</div>
              <div className="chat-message answer">{formData[step.key]}</div>
            </div>
          )
        ))}

        {chatHistory.map((entry, index) => (
          <div
            key={index}
            className={`chatbot-history-item ${
              entry.type === "user"
                ? "chat-message question"
                : "chat-message answer"
            }`}
          >
            {entry.message}
          </div>
        ))}
      </div>

      {formSent ? (
        <div>
          <h2 className="chatbot-complete-message">
            ¡Gracias! Tus respuestas se enviaron correctamente.
          </h2>
          <div className="chat-input-container">
            <h3>Escribe tu pregunta para el LLM:</h3>
            <div className="chat-input">
              <input
                type="text"
                className="chatbot-input"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder="Escribe tu pregunta aquí"
              />
              <button className="chatbot-submit" onClick={sendLLMRequest}>
                Enviar al LLM
              </button>
            </div>
          </div>
          {isLLMLoading && <h3>Cargando respuesta...</h3>}
        </div>
      ) : (
        <div className="chat-input-container">
          <h2 className="chatbot-question">{currentQuestion.question}</h2>
          <div className="chat-input">
            {currentQuestion.options ? (
              <select
                className="chatbot-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              >
                <option value="">Selecciona una opción</option>
                {currentQuestion.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="chatbot-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            )}
            <button className="chatbot-submit" onClick={handleSubmit}>
              Enviar
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </div>

      )}

    </div>
  );
}

export default ChatbotSanitario;

//---------------------------------
// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import "../../../styles/components/_ChatbotSanitario.scss";

// const initialData = {
//   id_sesion: "",
//   municipio_residencia: "",
//   ccaa: "",
//   ambito_laboral: "",
//   especialidad: "",
//   vih_usuario: "",
//   vih_diagnostico: "No tengo",
//   vih_tratamiento: "No tengo",
//   ha_tratado_vih: "",
//   como_conocio_felgtbi: "",
// };

// function ChatbotSanitario() {
//   const [formData, setFormData] = useState(initialData);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [inputValue, setInputValue] = useState("");
//   const [error, setError] = useState("");
//   const [formSent, setFormSent] = useState(false);
//   const [LLMmessage, setLLMmessage] = useState("");
//   const [isLLMLoading, setIsLLMLoading] = useState(false);
//   const [userQuestion, setUserQuestion] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);
//   const chatHistoryRef = useRef(null);
//   const lastMessageRef = useRef(null);

//   const steps = [
//     {
//       key: "municipio_residencia",
//       question: "¿En qué municipio resides?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu municipio de residencia.",
//     },
//     {
//       key: "ccaa",
//       question: "¿En qué comunidad autónoma resides?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu comunidad autónoma.",
//     },
//     {
//       key: "ambito_laboral",
//       question: "¿En qué ámbito laboral trabajas?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu ámbito laboral.",
//     },
//     {
//       key: "especialidad",
//       question: "¿Cuál es tu especialidad?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu especialidad.",
//     },
//     {
//       key: "vih_usuario",
//       question: "¿El paciente tiene vih?",
//       validate: (value) =>
//         ["si", "no", "No sabe / No contesta"].includes(value.toLowerCase()),
//       errorMessage: "Por favor, selecciona una respuesta.",
//     },
//     {
//       key: "vih_diagnostico",
//       question: "¿Cuándo recibiste el diagnóstico de vih?",
//       options: [
//         "Menos de un mes",
//         "Entre 1 y 3 meses",
//         "Entre 3 y 12 meses",
//         "Más de un año",
//       ],
//       validate: (value) =>
//         [
//           "menos de un mes",
//           "entre 1 y 3 meses",
//           "entre 3 y 12 meses",
//           "más de un año",
//         ].includes(value.toLowerCase()),
//       errorMessage: "Por favor, selecciona una opción válida.",
//       conditional: (formData) => formData.vih_usuario.toLowerCase() === "si",
//     },
//     {
//       key: "vih_tratamiento",
//       question: "¿Desde cuándo recibes tratamiento para el vih?",
//       options: [
//         "Menos de un mes",
//         "Entre 1 y 3 meses",
//         "Entre 3 y 12 meses",
//         "Más de un año",
//       ],
//       validate: (value) =>
//         [
//           "menos de un mes",
//           "entre 1 y 3 meses",
//           "entre 3 y 12 meses",
//           "más de un año",
//         ].includes(value.toLowerCase()),
//       errorMessage: "Por favor, selecciona una opción válida.",
//       conditional: (formData) => formData.vih_usuario.toLowerCase() === "si",
//     },
//     {
//       key: "ha_tratado_vih",
//       question: "¿Has tratado anteriormente con personas con vih?",
//       validate: (value) => ["si", "no"].includes(value.toLowerCase()),
//       errorMessage: "Por favor, responde con 'Sí' o 'No'.",
//     },
//     {
//       key: "como_conocio_felgtbi",
//       question: "¿Cómo has conocido a la FELGTBI+?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa cómo conociste la FELGTBI+.",
//     },
//   ];

//   const currentQuestion = steps[currentStep];

//   const handleConditionalSkip = (value) => {
//     if (currentQuestion.key === "vih_usuario" && value.toLowerCase() === "no") {
//       setCurrentStep(steps.findIndex((step) => step.key === "ha_tratado_vih"));
//       return true;
//     }
//     return false;
//   };

//   const handleSubmit = () => {
//     if (currentQuestion.validate(inputValue)) {
//       setFormData((prevData) => ({
//         ...prevData,
//         [currentQuestion.key]: inputValue,
//       }));
//       setInputValue("");
//       setError("");

//       if (!handleConditionalSkip(inputValue)) {
//         if (currentStep < steps.length - 1) {
//           setCurrentStep((prev) => prev + 1);
//         } else {
//           setFormSent(true);
//         }
//       }
//     } else {
//       setError(currentQuestion.errorMessage);
//     }
//   };

//   const sendLLMRequest = async () => {
//     const url = "http://52.214.54.221:8000/chatbot_profesional";
//     const dataForLLM = {
//       pregunta_profesional: userQuestion || "Sin pregunta específica",
//       municipio: formData.municipio_residencia || "N/A",
//       ccaa: formData.ccaa || "N/A",
//       conocer_felgtbi: formData.como_conocio_felgtbi || "N/A",
//       vih_usuario: formData.vih_usuario || "N/A",
//       vih_diagnostico: formData.vih_diagnostico || "N/A",
//       vih_tratamiento: formData.vih_tratamiento || "N/A",
//       pro_ambito: formData.ambito_laboral || "N/A",
//       pro_especialidad: formData.especialidad || "N/A",
//       pro_vih_profesional: formData.ha_tratado_vih || "N/A",
//     };

//     setChatHistory((prevHistory) => [
//       ...prevHistory,
//       { type: "user", message: "Procesando tu solicitud..." },
//     ]);

//     setIsLLMLoading(true);
//     try {
//       const response = await axios.post(url, dataForLLM, {
//         headers: { "Content-Type": "application/json" },
//       });
//       if (response.status === 200) {
//         setLLMmessage(response.data.respuesta_chat);
//         setChatHistory((prevHistory) => [
//           ...prevHistory,
//           { type: "bot", message: response.data.respuesta_chat },
//         ]);
//       }
//     } catch (error) {
//       console.error("Error en la interacción con el LLM:", error);
//       setChatHistory((prevHistory) => [
//         ...prevHistory,
//         { type: "bot", message: "Hubo un error al procesar tu solicitud." },
//       ]);
//     } finally {
//       setIsLLMLoading(false);
//     }
//   };

//   useEffect(() => {
//     setFormData((prevData) => ({
//       ...prevData,
//       id_sesion: `sesion_${Date.now()}`,
//     }));
//   }, []);

//   useEffect(() => {
//     if (lastMessageRef.current) {
//       lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [currentStep]);


//   return (
//     <div className="chatbot-container">
//       <div className="chatbot-history" ref={chatHistoryRef}>
//         {steps.slice(0, currentStep).map((step, index) => (
//           (!step.conditional || step.conditional(formData)) && (
//             <div
//                 key={index}
//                 className="chatbot-history-item" ref={index === currentStep - 1 ? lastMessageRef : null}
//               >
//               <div className="chat-message question">{step.question}</div>
//               <div className="chat-message answer">{formData[step.key]}</div>
//             </div>
//           )
//         ))}

//         {chatHistory.map((entry, index) => (
//           <div
//           key={index}
//           className={`chatbot-history-item ${
//             entry.type === "user"
//               ? "chat-message question"
//               : "chat-message answer"
//           }`}
//           >
//             {entry.message}
//           </div>
//         ))}
//       </div>

//       {formSent ? (
//         <div>
//           <h2 className="chatbot-complete-message">
//             ¡Gracias! Tus respuestas se enviaron correctamente.
//           </h2>
//           <div className="chat-input-container">
//             <h3>Escribe tu pregunta para el LLM:</h3>
//             <div className="chat-input">
//               <input
//                 type="text"
//                 className="chatbot-input"
//                 value={userQuestion}
//                 onChange={(e) => setUserQuestion(e.target.value)}
//                 placeholder="Escribe tu pregunta aquí"
//               />
//               <button className="chatbot-submit" onClick={sendLLMRequest}>
//                 Enviar al LLM
//               </button>
//             </div>
//           </div>
//           {isLLMLoading && <h3>Cargando respuesta...</h3>}
//         </div>
//       ) : (
//         <div className="chat-input-container">
//           <h2 className="chatbot-question">{currentQuestion.question}</h2>
//           <div className="chat-input">
//             {currentQuestion.options ? (
//               <select
//                 className="chatbot-input"
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//               >
//                 <option value="">Selecciona una opción</option>
//                 {currentQuestion.options.map((option, index) => (
//                   <option key={index} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
//             ) : (
//               <input
//                 type="text"
//                 className="chatbot-input"
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
//               />
//             )}
//             <button className="chatbot-submit" onClick={handleSubmit}>
//               Enviar
//             </button>
//           </div>
//           {error && <p className="error-message">{error}</p>}
//         </div>
//       )}
//     </div>
//   );
// }

// export default ChatbotSanitario;



//----------------Posible------------
// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import "../../../styles/components/_ChatbotSanitario.scss";

// const initialData = {
//   id_sesion: "",
//   municipio_residencia: "",
//   ccaa: "",
//   ambito_laboral: "",
//   especialidad: "",
//   vih_usuario: "",
//   vih_diagnostico: "No tengo",
//   vih_tratamiento: "No tengo",
//   ha_tratado_vih: "",
//   como_conocio_felgtbi: "",
// };

// function ChatbotSanitario() {
//   const [formData, setFormData] = useState(initialData);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [inputValue, setInputValue] = useState("");
//   const [error, setError] = useState("");
//   const [formSent, setFormSent] = useState(false);
//   const [LLMmessage, setLLMmessage] = useState("");
//   const [isLLMLoading, setIsLLMLoading] = useState(false);
//   const [userQuestion, setUserQuestion] = useState(""); // Para capturar la pregunta dinámica del usuario
//   const chatHistoryRef = useRef(null);
//   const lastMessageRef = useRef(null);

//   const steps = [
//     {
//       key: "municipio_residencia",
//       question: "¿En qué municipio resides?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu municipio de residencia.",
//     },
//     {
//       key: "ccaa",
//       question: "¿En qué comunidad autónoma resides?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu comunidad autónoma.",
//     },
//     {
//       key: "ambito_laboral",
//       question: "¿En qué ámbito laboral trabajas?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu ámbito laboral.",
//     },
//     {
//       key: "especialidad",
//       question: "¿Cuál es tu especialidad?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu especialidad.",
//     },
//     {
//       key: "vih_usuario",
//       question: "¿El paciente tiene vih?",
//       validate: (value) => ["si", "no", "No sabe / No contesta"].includes(value.toLowerCase()),
//       errorMessage: "Por favor, selecciona una respuesta.",
//     },
//     {
//       key: "vih_diagnostico",
//       question: "¿Cuándo recibiste el diagnóstico de vih?",
//       options: ["Menos de un mes", "Entre 1 y 3 meses", "Entre 3 y 12 meses", "Más de un año"],
//       validate: (value) =>
//         ["menos de un mes", "entre 1 y 3 meses", "entre 3 y 12 meses", "más de un año"].includes(
//           value.toLowerCase()
//         ),
//       errorMessage: "Por favor, selecciona una opción válida.",
//       conditional: (formData) => formData.vih_usuario.toLowerCase() === "si",
//     },
//     {
//       key: "vih_tratamiento",
//       question: "¿Desde cuándo recibes tratamiento para el vih?",
//       options: ["Menos de un mes", "Entre 1 y 3 meses", "Entre 3 y 12 meses", "Más de un año"],
//       validate: (value) =>
//         ["menos de un mes", "entre 1 y 3 meses", "entre 3 y 12 meses", "más de un año"].includes(
//           value.toLowerCase()
//         ),
//       errorMessage: "Por favor, selecciona una opción válida.",
//       conditional: (formData) => formData.vih_usuario.toLowerCase() === "si",
//     },
//     {
//       key: "ha_tratado_vih",
//       question: "¿Has tratado anteriormente con personas con vih?",
//       validate: (value) => ["si", "no"].includes(value.toLowerCase()),
//       errorMessage: "Por favor, responde con 'Sí' o 'No'.",
//     },
//     {
//       key: "como_conocio_felgtbi",
//       question: "¿Cómo has conocido a la FELGTBI+?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa cómo conociste la FELGTBI+.",
//     },
//   ];

//   const currentQuestion = steps[currentStep];

//   const handleConditionalSkip = (value) => {
//     if (currentQuestion.key === "vih_usuario" && value.toLowerCase() === "no") {
//       setCurrentStep(steps.findIndex((step) => step.key === "ha_tratado_vih"));
//       return true;
//     }
//     return false;
//   };

//   const handleSubmit = () => {
//     if (currentQuestion.validate(inputValue)) {
//       setFormData((prevData) => ({ ...prevData, [currentQuestion.key]: inputValue }));
//       setInputValue("");
//       setError("");

//       if (!handleConditionalSkip(inputValue)) {
//         if (currentStep < steps.length - 1) {
//           setCurrentStep((prev) => prev + 1);
//         } else {
//           setFormSent(true);
//         }
//       }
//     } else {
//       setError(currentQuestion.errorMessage);
//     }
//   };

//   const sendLLMRequest = async () => {
//     const url = "http://52.214.54.221:8000/chatbot_profesional";
//     const dataForLLM = {
//       pregunta_profesional: userQuestion || "Sin pregunta específica",
//       municipio: formData.municipio_residencia || "N/A",
//       ccaa: formData.ccaa || "N/A",
//       conocer_felgtbi: formData.como_conocio_felgtbi || "N/A",
//       vih_usuario: formData.vih_usuario || "N/A",
//       vih_diagnostico: formData.vih_diagnostico || "N/A",
//       vih_tratamiento: formData.vih_tratamiento || "N/A",
//       pro_ambito: formData.ambito_laboral || "N/A",
//       pro_especialidad: formData.especialidad || "N/A",
//       pro_vih_profesional: formData.ha_tratado_vih || "N/A",
//     };

//     setIsLLMLoading(true);
//     try {
//       const response = await axios.post(url, dataForLLM, {
//         headers: { "Content-Type": "application/json" },
//       });
//       if (response.status === 200) {
//         setLLMmessage(response.data.respuesta_chat);
//       }
//     } catch (error) {
//       console.error("Error en la interacción con el LLM:", error);
//     } finally {
//       setIsLLMLoading(false);
//     }
//   };

//   useEffect(() => {
//     setFormData((prevData) => ({
//       ...prevData,
//       id_sesion: `sesion_${Date.now()}`,
//     }));
//   }, []);

//   useEffect(() => {
//     if (lastMessageRef.current) {
//       lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [currentStep]);

//   return (
//     <div className="chatbot-container">
//       {formSent ? (
//         <div>
//           <h2 className="chatbot-complete-message">¡Gracias! Tus respuestas se enviaron correctamente.</h2>
//           <div className="chat-input-container">
//             <h3>Escribe tu pregunta para el LLM:</h3>
//             <input
//               type="text"
//               value={userQuestion}
//               onChange={(e) => setUserQuestion(e.target.value)}
//               placeholder="Escribe tu pregunta aquí"
//               className="chatbot-input"
//             />
//             <button className="chatbot-submit" onClick={sendLLMRequest}>
//               Enviar al LLM
//             </button>
//           </div>
//           {isLLMLoading ? (
//             <h3>Cargando respuesta...</h3>
//           ) : (
//             LLMmessage && <div className="llm-response">{LLMmessage}</div>
//           )}
//         </div>
//       ) : (
//         <>
//           <div className="chatbot-history" ref={chatHistoryRef}>
//             {steps.slice(0, currentStep).map((step, index) => (
//               (!step.conditional || step.conditional(formData)) && (
//                 <div key={index} ref={index === currentStep - 1 ? lastMessageRef : null}>
//                   <div className="chat-message question">{step.question}</div>
//                   <div className="chat-message answer">{formData[step.key]}</div>
//                 </div>
//               )
//             ))}
//           </div>
//           <div className="chat-input-container">
//             <h2>{currentQuestion.question}</h2>
//             {currentQuestion.options ? (
//               <select
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//               >
//                 <option value="">Selecciona una opción</option>
//                 {currentQuestion.options.map((option, index) => (
//                   <option key={index} value={option}>{option}</option>
//                 ))}
//               </select>
//             ) : (
//               <input
//                 type="text"
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
//                 autoFocus
//               />
//             )}
//             <button className="chatbot-submit" onClick={handleSubmit}>Enviar</button>
//             {error && <p className="error-message">{error}</p>}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default ChatbotSanitario;

//-----------------------ORIGINAL------------
// import React, { useState, useEffect, useRef } from "react";
// import "../../../styles/components/_ChatbotSanitario.scss";
// // import ChatbotLLM from "../ChatbotLLM/ChatbotLLM";
// import { useNavigate } from "react-router-dom";

// const initialData = {
//   id_sesion: "",
//   municipio_residencia: "",
//   ccaa: "",
//   ambito_laboral: "",
//   especialidad: "",
//   vih_usuario: "",
//   vih_diagnostico: "No tengo",
//   vih_tratamiento: "No tengo",
//   ha_tratado_vih: "",
//   como_conocio_felgtbi: "",
// };

// function ChatbotSanitario() {
//   const [datosFormulario, setdatosFormulario] = useState("");
//   const [LLM, setLLM] = useState(false);
//   const [formData, setFormData] = useState(initialData);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [inputValue, setInputValue] = useState("");
//   const [error, setError] = useState("");
//   const chatHistoryRef = useRef(null);
//   const lastMessageRef = useRef(null);

//   const steps = [
//     {
//       key: "municipio_residencia",
//       question: "¿En qué municipio resides?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu municipio de residencia.",
//     },
//     {
//       key: "ccaa",
//       question: "¿En qué comunidad autónoma resides?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu comunidad autónoma.",
//     },
//     {
//       key: "ambito_laboral",
//       question: "¿En qué ámbito laboral trabajas?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu ámbito laboral.",
//     },
//     {
//       key: "especialidad",
//       question: "¿Cuál es tu especialidad?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu especialidad.",
//     },
//     {
//       key: "vih_usuario",
//       question: "¿El paciente tiene vih?",
//       validate: (value) => ["si", "no", "No sabe / No contesta"].includes(value.toLowerCase()),
//       errorMessage: "Por favor, selecciona una respuesta.",
//     },
//     {
//       key: "vih_diagnostico",
//       question: "¿Cuándo recibiste el diagnóstico de vih? ejemplo: entre 1 y 3 meses o mas de un año",
//       options: ["Menos de un mes", "Entre 1 y 3 meses", "Entre 3 y 12 meses", "Más de un año"],
//       validate: (value) => ["menos de un mes", "entre 1 y 3 meses", "entre 3 y 12 meses", "más de un año"].includes(value.toLowerCase()),
//       errorMessage: "Por favor, selecciona una opción válida.",
//       conditional: (formData) => formData.vih_usuario.toLowerCase() === "si",
//     },
//     {
//       key: "vih_tratamiento",
//       question: "¿Desde cuándo recibes tratamiento para el vih? ejemplo: entre 1 y 3 meses o mas de un año",
//       options: ["Menos de un mes", "Entre 1 y 3 meses", "Entre 3 y 12 meses", "Más de un año"],
//       validate: (value) => ["menos de un mes", "entre 1 y 3 meses", "entre 3 y 12 meses", "más de un año"].includes(value.toLowerCase()),
//       errorMessage: "Por favor, selecciona una opción válida.",
//       conditional: (formData) => formData.vih_usuario.toLowerCase() === "sí",
//     },
//     {
//       key: "ha_tratado_vih",
//       question: "¿Has tratado anteriormente con personas con vih?", // Se cambió de 'pro_vih_profesional' a 'ha_tratado_vih'
//       validate: (value) => ["si", "no"].includes(value.toLowerCase()),
//       errorMessage: "Por favor, responde con 'Sí' o 'No'.",
//     },
//     {
//       key: "como_conocio_felgtbi",
//       question: "¿Cómo has conocido a la FELGTBI+?", // Se cambió de 'conocer_felgtbi' a 'como_conocio_felgtbi'
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa cómo conociste la FELGTBI+.",
//     },
//   ];
//   const currentQuestion = steps[currentStep];

//   const handleConditionalSkip = (value) => {
//     if (currentQuestion.key === "vih_usuario") {
//       if (value.toLowerCase() === "no") {
//         setCurrentStep(steps.findIndex((step) => step.key === "ha_tratado_vih"));
//         return true;
//       }
//     }
//     if (currentQuestion.key === "vih_tratamiento" && formData.vih_usuario.toLowerCase() === "si") {
//       if (value.toLowerCase() === "no") {
//         setCurrentStep(steps.findIndex((step) => step.key === "ha_tratado_vih"));
//         return true;
//       }
//     }
//     return false;
//   };

//   const handleSubmit = async () => {
//     if (currentQuestion.validate(inputValue)) {
//       const updatedValue = currentQuestion.key === "edad" ? Number(inputValue) : inputValue;
//       setFormData({ ...formData, [currentQuestion.key]: updatedValue });
//       setInputValue("");
//       setError("");

//       if (!handleConditionalSkip(inputValue)) {
//         if (currentStep < steps.length - 1) {
//           setCurrentStep(currentStep + 1);
//         } else {
//           setCurrentStep(steps.length);
//         }
//       }
//     } else {
//       setError(currentQuestion.errorMessage);
//     }
//   };
//   const sendForm = async () => {
//     const sessionId = formData.id_sesion || "sesion_predeterminada";

//     setLLM(true);

//     const updatedFormData = {
//       ...formData,
//       id_sesion: sessionId,
//       vih_diagnostico: formData.vih_diagnostico || "No tengo", // Valor predeterminado
//       vih_tratamiento: formData.vih_tratamiento || "No tengo", // Valor predeterminado
//     };

//     const missingFields = Object.keys(updatedFormData).filter(
//       (key) => key !== "vih_tratamiento" && key !== "vih_diagnostico" && !updatedFormData[key].trim()
//     );

//     if (missingFields.length > 0) {
//       alert(`Faltan campos obligatorios: ${missingFields.join(", ")}`);
//       return;
//     }

//     try {
//       const response = await fetch("http://52.214.54.221:8000/respuesta-profesional", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedFormData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("Detalles del error:", errorData);
//         alert("Error al enviar el formulario. Por favor, inténtalo de nuevo.");
//       } else {
//         console.log("Datos enviados correctamente:", updatedFormData);
//         alert("¡Formulario enviado exitosamente!");
//         setdatosFormulario(updatedFormData);
//       }
//     } catch (error) {
//       console.error("Error al enviar los datos:", error);
//       alert("Hubo un error al enviar los datos: " + error.message);
//     }
//   };

//   useEffect(() => {
//     setFormData((prevData) => ({
//       ...prevData,
//       id_sesion: "sesion_" + Date.now(),
//     }));
//   }, []);

//   useEffect(() => {
//     if (lastMessageRef.current) {
//       lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [currentStep]);

//   return (
//     <div className="chatbot-container">
//       <div className="chatbot-history" ref={chatHistoryRef}>
//         {steps.slice(0, currentStep).map((step, index) =>
//           step.conditional && !step.conditional(formData) ? null : (
//             <div
//               key={index}
//               className="chatbot-history-item"
//               ref={index === currentStep - 1 ? lastMessageRef : null}
//             >
//               <div className="chat-message question">{step.question}</div>
//               <div className="chat-message answer">{formData[step.key]}</div>
//             </div>
//           )
//         )}
//       </div>

//       {currentStep < steps.length ? (
//         <div>
//           <h2 className="chatbot-question">{currentQuestion.question}</h2>
//           <div className="chat-input">
//             <input
//               type="text"
//               className="chatbot-input"
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
//               autoFocus
//             />
//             <button className="chatbot-submit" onClick={handleSubmit}>
//               Enviar
//             </button>
//           </div>
//           {error && <p className="error-message">{error}</p>}

//         </div>
//       ) : ( <>
//         <>
//           <h2 className="chatbot-complete-message">¡Formulario completo!</h2>
//           <button onClick={sendForm}>Enviar respuestas</button>
//           { LLM ? <ChatbotLLM data={datosFormulario}/> : ""}
//         </>
//         </> )}
//     </div>
//   );
// }

// export default ChatbotSanitario;
//--------------------FINAL----------------------

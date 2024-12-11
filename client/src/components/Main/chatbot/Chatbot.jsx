import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../../../styles/Styles.scss";

const initialData = {
  id_sesion: "",
  edad: "",
  pais_origen: "",
  ccaa: "",
  municipio_residencia: "",
  genero: "",
  orientacion_sexual: "",
  situacion_afectiva: "",
  tiene_vih: "",
  fecha_diagnostico: "",
  fecha_inicio_tratamiento: "",
  hablado_con_alguien: "",
  como_conocio_felgtbi: "",
};

function Chatbot() {
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
            key: "edad",
            question: "¿Cuál es tu edad?",
            validate: (value) =>
              /^\d+$/.test(value) && Number(value) > 17 && Number(value) < 101,
            errorMessage: "Por favor, ingresa una edad válida entre 18 y 100 años.",
          },
          {
            key: "pais_origen",
            question: "¿Cuál es tu país de origen?",
            validate: (value) => value.trim().length > 0,
            errorMessage: "Por favor, ingresa tu país de origen.",
          },
          {
            key: "ccaa",
            question: "¿Cuál es tu comunidad autónoma?",
            validate: (value) => value.trim().length > 0,
            errorMessage: "Por favor, ingresa tu comunidad autónoma.",
          },
          {
            key: "municipio_residencia",
            question: "¿Cuál es tu municipio de residencia?",
            validate: (value) => value.trim().length > 0,
            errorMessage: "Por favor, ingresa tu municipio de residencia.",
          },
          {
            key: "genero",
            question: "¿Cuál es tu género?",
            validate: (value) => value.trim().length > 0,
            errorMessage: "Por favor, especifica tu género.",
          },
          {
            key: "orientacion_sexual",
            question: "¿Cuál es tu orientación sexual?",
            validate: (value) => value.trim().length > 0,
            errorMessage: "Por favor, ingresa tu orientación sexual.",
          },
          {
            key: "situacion_afectiva",
            question: "¿Cuál es tu situación afectiva?",
            validate: (value) => value.trim().length > 0,
            errorMessage: "Por favor, ingresa tu situación afectiva.",
          },
          {
            key: "tiene_vih",
            question: "¿Tienes diagnóstico previo de VIH?",
            validate: (value) => ["si", "no"].includes(value.toLowerCase()),
            errorMessage: "Por favor, responde con 'Sí' o 'No'.",
          },
          {
            key: "fecha_diagnostico",
            question: "¿Cuándo recibiste el diagnóstico de VIH?",
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
            conditional: (formData) => formData.tiene_vih.toLowerCase() === "si",
          },
          {
            key: "fecha_inicio_tratamiento",
            question: "¿Desde cuándo recibes tratamiento para el VIH?",
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
            conditional: (formData) => formData.tiene_vih.toLowerCase() === "si",
          },
          {
            key: "como_conocio_felgtbi",
            question: "¿Cómo conociste FELGTBI?",
            validate: (value) => value.trim().length > 0,
            errorMessage: "Por favor, ingresa cómo conociste FELGTBI.",
          },
        ];
  

  const currentQuestion = steps[currentStep];

  const handleConditionalSkip = (value) => {
    if (currentQuestion.key === "tiene_vih" && value.toLowerCase() === "no") {
      const nextStepIndex = steps.findIndex(
        (step) => step.key === "como_conocio_felgtbi"
      );
      setCurrentStep(nextStepIndex);
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
          sendForm(); // Llama a la función para enviar los datos a la base de datos
        }
      }
    } else {
      setError(currentQuestion.errorMessage);
    }
  };

  const sendForm = async () => {
    const sessionId = formData.id_sesion || `sesion_${Date.now()}`;
    const updatedFormData = {
      ...formData,
      id_sesion: sessionId,
    };

    try {
      const response = await fetch("http://52.214.54.221:8000/respuesta-usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error al enviar los datos: ${errorData.message || response.statusText}`
        );
      }

      console.log("Datos enviados correctamente:", updatedFormData);
      alert("¡Formulario enviado exitosamente!");
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Hubo un error al enviar los datos: " + error.message);
    }
  };

  const sendLLMRequest = async () => {
    sendForm();
    const url = "http://52.214.54.221:8000/chatbot_usuario";
    const dataForLLM = {
      pregunta_usuario: userQuestion || "Sin pregunta específica",
      municipio: formData.municipio_residencia || "N/A",
      ccaa: formData.ccaa || "N/A",
      conocer_felgtbi: formData.como_conocio_felgtbi || "N/A",
      vih_usuario: formData.tiene_vih || "N/A",
      vih_diagnostico: formData.fecha_diagnostico || "N/A",
      vih_tratamiento: formData.fecha_inicio_tratamiento || "N/A",
      us_edad: Number(formData.edad) || 0,
      us_pais_origen: formData.pais_origen || "N/A",
      us_genero: formData.genero || "N/A",
      us_orientacion: formData.orientacion_sexual || "N/A",
      us_situacion_afectiva: formData.situacion_afectiva || "N/A",
      us_hablado: formData.hablado_con_alguien || "N/A",
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
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentStep]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      id_sesion: `sesion_${Date.now()}`,
    }));
  }, []);

  return (
    <div className="chatbot-container">
      <div className="chatbot-history" ref={chatHistoryRef}>
        {steps.slice(0, currentStep).map(
          (step, index) =>
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
        )}
        {chatHistory.map((entry, index) => (
          <div
            key={index}
            className={`chatbot-history-item ${
              entry.type === "user"
                ? "chat-message question"
                : "chat-message answer"
            }`}
            ref={index === chatHistory.length - 1 ? lastMessageRef : null}
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

export default Chatbot;


//------------------------------
// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import "../../../styles/Styles.scss";

// const initialData = {
//   id_sesion: "",
//   edad: "",
//   pais_origen: "",
//   ccaa: "",
//   municipio_residencia: "",
//   genero: "",
//   orientacion_sexual: "",
//   situacion_afectiva: "",
//   tiene_vih: "",
//   fecha_diagnostico: "",
//   fecha_inicio_tratamiento: "",
//   hablado_con_alguien: "",
//   como_conocio_felgtbi: "",
// };

// function Chatbot() {
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
//   const [LLM, setLLM] = useState(false);

//   const steps = [
//     {
//       key: "edad",
//       question: "¿Cuál es tu edad?",
//       validate: (value) =>
//         /^\d+$/.test(value) && Number(value) > 17 && Number(value) < 101,
//       errorMessage: "Por favor, ingresa una edad válida entre 18 y 100 años.",
//     },
//     {
//       key: "pais_origen",
//       question: "¿Cuál es tu país de origen?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu país de origen.",
//     },
//     {
//       key: "ccaa",
//       question: "¿Cuál es tu comunidad autónoma?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu comunidad autónoma.",
//     },
//     {
//       key: "municipio_residencia",
//       question: "¿Cuál es tu municipio de residencia?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu municipio de residencia.",
//     },
//     {
//       key: "genero",
//       question: "¿Cuál es tu género?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, especifica tu género.",
//     },
//     {
//       key: "orientacion_sexual",
//       question: "¿Cuál es tu orientación sexual?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu orientación sexual.",
//     },
//     {
//       key: "situacion_afectiva",
//       question: "¿Cuál es tu situación afectiva?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu situación afectiva.",
//     },
//     {
//       key: "tiene_vih",
//       question: "¿Tienes diagnóstico previo de VIH?",
//       validate: (value) => ["si", "no"].includes(value.toLowerCase()),
//       errorMessage: "Por favor, responde con 'Sí' o 'No'.",
//     },
//     {
//       key: "fecha_diagnostico",
//       question: "¿Cuándo recibiste el diagnóstico de VIH?",
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
//       conditional: (formData) => formData.tiene_vih.toLowerCase() === "si",
//     },
//     {
//       key: "fecha_inicio_tratamiento",
//       question: "¿Desde cuándo recibes tratamiento para el VIH?",
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
//       conditional: (formData) => formData.tiene_vih.toLowerCase() === "si",
//     },
//     {
//       key: "como_conocio_felgtbi",
//       question: "¿Cómo conociste FELGTBI?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa cómo conociste FELGTBI.",
//     },
//   ];

//   const currentQuestion = steps[currentStep];

//   const handleConditionalSkip = (value) => {
//     if (currentQuestion.key === "tiene_vih" && value.toLowerCase() === "no") {
//       const nextStepIndex = steps.findIndex(
//         (step) => step.key === "como_conocio_felgtbi"
//       );
//       setCurrentStep(nextStepIndex);
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


//   const sendLLMRequest = async () => {
//     sendForm();
//     const url = "http://52.214.54.221:8000/chatbot_usuario";
//     const dataForLLM = {
//       pregunta_usuario: userQuestion || "Sin pregunta específica",
//       municipio: formData.municipio_residencia || "N/A",
//       ccaa: formData.ccaa || "N/A",
//       conocer_felgtbi: formData.como_conocio_felgtbi || "N/A",
//       vih_usuario: formData.tiene_vih || "N/A",
//       vih_diagnostico: formData.fecha_diagnostico || "N/A",
//       vih_tratamiento: formData.fecha_inicio_tratamiento || "N/A",
//       us_edad: Number(formData.edad) || 0,
//       us_pais_origen: formData.pais_origen || "N/A",
//       us_genero: formData.genero || "N/A",
//       us_orientacion: formData.orientacion_sexual || "N/A",
//       us_situacion_afectiva: formData.situacion_afectiva || "N/A",
//       us_hablado: formData.hablado_con_alguien || "N/A",
//     };

//     setChatHistory((prevHistory) => [
//       ...prevHistory,
//       { type: "user", message: userQuestion || "Sin pregunta específica" },
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
//     if (lastMessageRef.current) {
//       lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [currentStep]);

//   useEffect(() => {
//     setFormData((prevData) => ({
//       ...prevData,
//       id_sesion: `sesion_${Date.now()}`,
//     }));
//   }, []);

//   return (
//     <div className="chatbot-container">
//       <div className="chatbot-history" ref={chatHistoryRef}>
//         {steps.slice(0, currentStep).map(
//           (step, index) =>
//             (!step.conditional || step.conditional(formData)) && (
//               <div
//                 key={index}
//                 className="chatbot-history-item" ref={index === currentStep - 1 ? lastMessageRef : null}
//               >
//                 <div className="chat-message question">{step.question}</div>
//                 <div className="chat-message answer">{formData[step.key]}</div>
//               </div>
//             )
//         )}
//         {chatHistory.map((entry, index) => (
//           <div
//             key={index}
//             className={`chatbot-history-item ${
//               entry.type === "user"
//                 ? "chat-message question"
//                 : "chat-message answer"
//             }`}
//             ref={index === chatHistory.length - 1 ? lastMessageRef : null}
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
//             <input
//               type="text"
//               className="chatbot-input"
//               value={userQuestion}
//               onChange={(e) => setUserQuestion(e.target.value)}
//               placeholder="Escribe tu pregunta aquí"
//             />
//             <button className="chatbot-submit" onClick={sendLLMRequest}>
//               Enviar al LLM
//             </button>
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

// export default Chatbot;



//----------------------Anly---------------
// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import "../../../styles/Styles.scss";

// const initialData = {
//   id_sesion: "",
//   edad: "",
//   pais_origen: "",
//   ccaa: "",
//   municipio_residencia: "",
//   genero: "",
//   orientacion_sexual: "",
//   situacion_afectiva: "",
//   tiene_vih: "",
//   fecha_diagnostico: "",
//   fecha_inicio_tratamiento: "",
//   hablado_con_alguien: "",
//   como_conocio_felgtbi: "",
// };

// function Chatbot() {
//   const [formData, setFormData] = useState(initialData);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [inputValue, setInputValue] = useState("");
//   const [error, setError] = useState("");
//   const [formSent, setFormSent] = useState(false);
//   const [LLMmessage, setLLMmessage] = useState("");
//   const [isLLMLoading, setIsLLMLoading] = useState(false);
//   const [userQuestion, setUserQuestion] = useState("");
//   const [chatHistory, setChatHistory] = useState([]); // Historial del chat
//   const chatHistoryRef = useRef(null);
//   const lastMessageRef = useRef(null);

//   const steps = [
//     {
//       key: "edad",
//       question: "¿Cuál es tu edad?",
//       validate: (value) =>
//         /^\d+$/.test(value) && Number(value) > 17 && Number(value) < 101,
//       errorMessage: "Por favor, ingresa una edad válida entre 18 y 100 años.",
//     },
//     {
//       key: "pais_origen",
//       question: "¿Cuál es tu país de origen?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu país de origen.",
//     },
//     {
//       key: "ccaa",
//       question: "¿Cuál es tu comunidad autónoma?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu comunidad autónoma.",
//     },
//     {
//       key: "municipio_residencia",
//       question: "¿Cuál es tu municipio de residencia?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu municipio de residencia.",
//     },
//     {
//       key: "genero",
//       question: "¿Cuál es tu género?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, especifica tu género.",
//     },
//     {
//       key: "orientacion_sexual",
//       question: "¿Cuál es tu orientación sexual?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu orientación sexual.",
//     },
//     {
//       key: "situacion_afectiva",
//       question: "¿Cuál es tu situación afectiva?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu situación afectiva.",
//     },
//     {
//       key: "tiene_vih",
//       question: "¿Tienes diagnóstico previo de VIH?",
//       validate: (value) => ["si", "no"].includes(value.toLowerCase()),
//       errorMessage: "Por favor, responde con 'Sí' o 'No'.",
//     },
//     {
//       key: "fecha_diagnostico",
//       question: "¿Cuándo recibiste el diagnóstico de VIH?",
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
//       conditional: (formData) => formData.tiene_vih.toLowerCase() === "si",
//     },
//     {
//       key: "fecha_inicio_tratamiento",
//       question: "¿Desde cuándo recibes tratamiento para el VIH?",
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
//       conditional: (formData) => formData.tiene_vih.toLowerCase() === "si",
//     },
//     {
//       key: "como_conocio_felgtbi",
//       question: "¿Cómo conociste FELGTBI?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa cómo conociste FELGTBI.",
//     },
//   ];

//   const currentQuestion = steps[currentStep];

//   const handleConditionalSkip = (value) => {
//     if (currentQuestion.key === "tiene_vih" && value.toLowerCase() === "no") {
//       const nextStepIndex = steps.findIndex(
//         (step) => step.key === "como_conocio_felgtbi"
//       );
//       setCurrentStep(nextStepIndex);
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
//     const url = "http://52.214.54.221:8000/chatbot_usuario";
//     const dataForLLM = {
//       pregunta_usuario: userQuestion || "Sin pregunta específica",
//       municipio: formData.municipio_residencia || "N/A",
//       ccaa: formData.ccaa || "N/A",
//       conocer_felgtbi: formData.como_conocio_felgtbi || "N/A",
//       vih_usuario: formData.tiene_vih || "N/A",
//       vih_diagnostico: formData.fecha_diagnostico || "N/A",
//       vih_tratamiento: formData.fecha_inicio_tratamiento || "N/A",
//       us_edad: Number(formData.edad) || 0,
//       us_pais_origen: formData.pais_origen || "N/A",
//       us_genero: formData.genero || "N/A",
//       us_orientacion: formData.orientacion_sexual || "N/A",
//       us_situacion_afectiva: formData.situacion_afectiva || "N/A",
//       us_hablado: formData.hablado_con_alguien || "N/A",
//     };

//     console.log(dataForLLM);

//     setChatHistory((prevHistory) => [
//       ...prevHistory,
//       { type: "user", message: userQuestion || "Sin pregunta específica" },
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
//     if (chatHistoryRef.current) {
//       chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
//     }
//   }, [chatHistory]);

//   useEffect(() => {
//     setFormData((prevData) => ({
//       ...prevData,
//       id_sesion: `sesion_${Date.now()}`,
//     }));
//   }, []);
//   return (
//     <div className="chatbot-container">
//       <div className="chatbot-history" ref={chatHistoryRef}>
//         {steps.slice(0, currentStep).map(
//           (step, index) =>
//             (!step.conditional || step.conditional(formData)) && (
//               <div
//                 key={index}
//                 className="chatbot-history-item"
//                 ref={index === chatHistory.length - 1 ? lastMessageRef : null}
//               >
//                 <div className="chat-message question">{step.question}</div>
//                 <div className="chat-message answer">{formData[step.key]}</div>
//               </div>
//             )
//         )}
//         {chatHistory.map((entry, index) => (
//           <div
//             key={index}
//             className={`chatbot-history-item ${
//               entry.type === "user"
//                 ? "chat-message question"
//                 : "chat-message answer"
//             }`}
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
//             <input
//               type="text"
//               className="chatbot-input"
//               value={userQuestion}
//               onChange={(e) => setUserQuestion(e.target.value)}
//               placeholder="Escribe tu pregunta aquí"
//             />
//             <button className="chatbot-submit" onClick={sendLLMRequest}>
//               Enviar al LLM
//             </button>
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

// export default Chatbot;

//--------------posible------------
// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import "../../../styles/Styles.scss";

// const initialData = {
//   id_sesion: "",
//   edad: "",
//   pais_origen: "",
//   ccaa: "",
//   municipio_residencia: "",
//   genero: "",
//   orientacion_sexual: "",
//   situacion_afectiva: "",
//   tiene_vih: "",
//   fecha_diagnostico: "",
//   fecha_inicio_tratamiento: "",
//   hablado_con_alguien: "",
//   como_conocio_felgtbi: "",
// };

// function Chatbot() {
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
//       key: "edad",
//       question: "¿Cuál es tu edad?",
//       validate: (value) => /^\d+$/.test(value) && Number(value) > 17 && Number(value) < 101,
//       errorMessage: "Por favor, ingresa una edad válida entre 18 y 100 años.",
//     },
//     {
//       key: "pais_origen",
//       question: "¿Cuál es tu país de origen?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu país de origen.",
//     },
//     {
//       key: "ccaa",
//       question: "¿Cuál es tu comunidad autónoma?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu comunidad autónoma.",
//     },
//     {
//       key: "municipio_residencia",
//       question: "¿Cuál es tu municipio de residencia?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu municipio de residencia.",
//     },
//     {
//       key: "genero",
//       question: "¿Cuál es tu género?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, especifica tu género.",
//     },
//     {
//       key: "orientacion_sexual",
//       question: "¿Cuál es tu orientación sexual?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu orientación sexual.",
//     },
//     {
//       key: "situacion_afectiva",
//       question: "¿Cuál es tu situación afectiva?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu situación afectiva.",
//     },
//     {
//       key: "tiene_vih",
//       question: "¿Tienes diagnóstico previo de VIH?",
//       validate: (value) => ["si", "no"].includes(value.toLowerCase()),
//       errorMessage: "Por favor, responde con 'Sí' o 'No'.",
//     },
//     {
//       key: "fecha_diagnostico",
//       question: "¿Cuándo recibiste el diagnóstico de VIH?",
//       options: ["Menos de un mes", "Entre 1 y 3 meses", "Entre 3 y 12 meses", "Más de un año"],
//       validate: (value) =>
//         ["menos de un mes", "entre 1 y 3 meses", "entre 3 y 12 meses", "más de un año"].includes(
//           value.toLowerCase()
//         ),
//       errorMessage: "Por favor, selecciona una opción válida.",
//       conditional: (formData) => formData.tiene_vih.toLowerCase() === "si",
//     },
//     {
//       key: "fecha_inicio_tratamiento",
//       question: "¿Desde cuándo recibes tratamiento para el VIH?",
//       options: ["Menos de un mes", "Entre 1 y 3 meses", "Entre 3 y 12 meses", "Más de un año"],
//       validate: (value) =>
//         ["menos de un mes", "entre 1 y 3 meses", "entre 3 y 12 meses", "más de un año"].includes(
//           value.toLowerCase()
//         ),
//       errorMessage: "Por favor, selecciona una opción válida.",
//       conditional: (formData) => formData.tiene_vih.toLowerCase() === "si",
//     },
//     {
//       key: "como_conocio_felgtbi",
//       question: "¿Cómo conociste FELGTBI?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa cómo conociste FELGTBI.",
//     },
//   ];

//   const currentQuestion = steps[currentStep];

//   const handleConditionalSkip = (value) => {
//     if (currentQuestion.key === "tiene_vih" && value.toLowerCase() === "no") {
//       const nextStepIndex = steps.findIndex((step) => step.key === "como_conocio_felgtbi");
//       setCurrentStep(nextStepIndex);
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
//     const url = "http://52.214.54.221:8000/chatbot_usuario";
//     const dataForLLM = {
//       pregunta_usuario: userQuestion || "Sin pregunta específica",
//       municipio: formData.municipio_residencia || "N/A",
//       ccaa: formData.ccaa || "N/A",
//       conocer_felgtbi: formData.como_conocio_felgtbi || "N/A",
//       vih_usuario: formData.tiene_vih || "N/A",
//       vih_diagnostico: formData.fecha_diagnostico || "N/A",
//       vih_tratamiento: formData.fecha_inicio_tratamiento || "N/A",
//       us_edad: Number(formData.edad) || 0,
//       us_pais_origen: formData.pais_origen || "N/A",
//       us_genero: formData.genero || "N/A",
//       us_orientacion: formData.orientacion_sexual || "N/A",
//       us_situacion_afectiva: formData.situacion_afectiva || "N/A",
//       us_hablado: formData.hablado_con_alguien || "N/A",
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
//     if (lastMessageRef.current) {
//       lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [currentStep]);

//   useEffect(() => {
//     setFormData((prevData) => ({
//       ...prevData,
//       id_sesion: `sesion_${Date.now()}`,
//     }));
//   }, []);

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
//               />
//             )}
//             <button onClick={handleSubmit}>Enviar</button>
//             {error && <p>{error}</p>}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default Chatbot;

//-------------------------ORIGINAL--------------------------
// import { useState, useEffect, useRef } from "react";
// import "../../../styles/Styles.scss";

// const initialData = {
//   id_sesion: "",
//   edad: "",
//   pais_origen: "",
//   ccaa: "",
//   municipio_residencia: "",
//   genero: "",
//   orientacion_sexual: "",
//   situacion_afectiva: "",
//   tiene_vih: "",
//   fecha_diagnostico: "",
//   fecha_inicio_tratamiento: "",
//   hablado_con_alguien: "",
//   como_conocio_felgtbi: "",
// };

// function Chatbot() {
//   const [formData, setFormData] = useState(initialData);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [inputValue, setInputValue] = useState("");
//   const [error, setError] = useState("");
//   const [formSent, setFormSent] = useState(false);
//   const chatHistoryRef = useRef(null);
//   const lastMessageRef = useRef(null);

//   const steps = [
//     {
//       key: "edad",
//       question: "¿Cuál es tu edad?",
//       validate: (value) => /^\d+$/.test(value) && Number(value) > 17 && Number(value) < 101,
//       errorMessage: "Por favor, ingresa una edad válida entre 18 y 100 años.",
//     },
//     {
//       key: "pais_origen",
//       question: "¿Cuál es tu país de origen?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu país de origen.",
//     },
//     {
//       key: "ccaa",
//       question: "¿Cuál es tu comunidad autónoma?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu comunidad autónoma.",
//     },
//     {
//       key: "municipio_residencia",
//       question: "¿Cuál es tu municipio de residencia?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu municipio de residencia.",
//     },
//     {
//       key: "genero",
//       question: "¿Cuál es tu género?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, especifica tu género.",
//     },
//     {
//       key: "orientacion_sexual",
//       question: "¿Cuál es tu orientación sexual?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu orientación sexual.",
//     },
//     {
//       key: "situacion_afectiva",
//       question: "¿Cuál es tu situación afectiva?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa tu situación afectiva.",
//     },
//     {
//       key: "tiene_vih",
//       question: "¿Tienes diagnóstico previo de VIH?",
//       validate: (value) => ["si", "no"].includes(value.toLowerCase()),
//       errorMessage: "Por favor, responde con 'Sí' o 'No'.",
//     },
//     {
//       key: "fecha_diagnostico",
//       question: "¿Cuándo recibiste el diagnóstico de VIH?",
//       options: ["Menos de un mes", "Entre 1 y 3 meses", "Entre 3 y 12 meses", "Más de un año"],
//       validate: (value) =>
//         ["menos de un mes", "entre 1 y 3 meses", "entre 3 y 12 meses", "más de un año"].includes(
//           value.toLowerCase()
//         ),
//       errorMessage: "Por favor, selecciona una opción válida.",
//       conditional: (formData) => formData.tiene_vih.toLowerCase() === "si",
//     },
//     {
//       key: "fecha_inicio_tratamiento",
//       question: "¿Desde cuándo recibes tratamiento para el VIH?",
//       options: ["Menos de un mes", "Entre 1 y 3 meses", "Entre 3 y 12 meses", "Más de un año"],
//       validate: (value) =>
//         ["menos de un mes", "entre 1 y 3 meses", "entre 3 y 12 meses", "más de un año"].includes(
//           value.toLowerCase()
//         ),
//       errorMessage: "Por favor, selecciona una opción válida.",
//       conditional: (formData) => formData.tiene_vih.toLowerCase() === "si",
//     },
//     {
//       key: "fecha_inicio_tratamiento",
//       question: "¿Desde cuándo recibes tratamiento para el VIH?",
//       options: ["Menos de un mes", "Entre 1 y 3 meses", "Entre 3 y 12 meses", "Más de un año"],
//       validate: (value) =>
//         ["menos de un mes", "entre 1 y 3 meses", "entre 3 y 12 meses", "más de un año"].includes(
//           value.toLowerCase()
//         ),
//       errorMessage: "Por favor, selecciona una opción válida.",
//       conditional: (formData) => formData.tiene_vih.toLowerCase() === "si",
//     },
//     {
//       key: "como_conocio_felgtbi",
//       question: "¿Cómo conociste FELGTBI?",
//       validate: (value) => value.trim().length > 0,
//       errorMessage: "Por favor, ingresa cómo conociste FELGTBI.",
//     },
//   ];

//   const currentQuestion = steps[currentStep];

//   const handleConditionalSkip = (value) => {
//     if (currentQuestion.key === "tiene_vih") {
//       if (value.toLowerCase() === "no") {
//         setCurrentStep(steps.findIndex((step) => step.key === "como_conocio_felgtbi"));
//         return true;
//       }
//     }
//     return false;
//   };

//   const handleSubmit = () => {
//     if (currentQuestion.validate(inputValue)) {
//       const updatedValue = currentQuestion.key === "edad" ? Number(inputValue) : inputValue;
//       setFormData({ ...formData, [currentQuestion.key]: updatedValue });
//       setInputValue("");
//       setError("");

//       if (!handleConditionalSkip(inputValue)) {
//         if (currentStep < steps.length - 1) {
//           setCurrentStep(currentStep + 1);
//         } else {
//           setFormSent(true);
//         }
//       }
//     } else {
//       setError(currentQuestion.errorMessage);
//     }
//   };

//   const sendForm = async () => {
//     const sessionId = formData.id_sesion || "sesion_predeterminada"; // Ajusta esto según sea necesario
//     const updatedFormData = { ...formData, id_sesion: sessionId };

//     try {
//       const response = await fetch("http://52.214.54.221:8000/respuesta-usuario", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedFormData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(`Error al enviar los datos: ${errorData.message || response.statusText}`);
//       }
//       console.log("Datos enviados", formData)
//       alert("¡Gracias! Tus respuestas se enviaron correctamente.");
//     } catch (error) {
//       console.error(error);
//       alert("Hubo un error al enviar los datos: " + error.message);
//     }
//   };

//   useEffect(() => {
//     if (lastMessageRef.current) {
//       lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [currentStep]);

//   useEffect(() => {
//     setFormData((prevData) => ({
//       ...prevData,
//       id_sesion: "sesion_" + Date.now(),
//     }));
//   }, []);

//   /*  useEffect(() => {
//      if (chatHistoryRef.current) {
//        chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
//      }
//    }, [currentStep]);
//   */
//   return (
//     <div className="chatbot-container">
//       {formSent ? (
//         <div>
//           <h2 className="chatbot-complete-message">¡Gracias! Tus respuestas se enviaron correctamente.</h2>
//           <button className="chatbot-submit" onClick={sendForm}>
//             Enviar nuevamente
//           </button>
//         </div>
//       ) : (
//         <>
//           <div className="chatbot-history" ref={chatHistoryRef}>
//             {steps.slice(0, currentStep).map((step, index) => (
//               step.conditional && !step.conditional(formData) ? null : (
//                 <div key={index} className="chatbot-history-item" ref={index === currentStep - 1 ? lastMessageRef : null}>
//                   <div className="chat-message question">{step.question}</div>
//                   <div className="chat-message answer">{formData[step.key]}</div>
//                 </div>
//               )
//             ))}
//           </div>

//           <div className="chat-input-container">
//             <h2 className="chatbot-question">{currentQuestion.question}</h2>
//             <div className="chat-input">
//               {currentQuestion.options ? (
//                 <select
//                   className="chatbot-input"
//                   value={inputValue}
//                   onChange={(e) => setInputValue(e.target.value)}
//                 >
//                   <option value="">Selecciona una opción</option>
//                   {currentQuestion.options.map((option, index) => (
//                     <option key={index} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <input
//                   type="text"
//                   className="chatbot-input"
//                   value={inputValue}
//                   onChange={(e) => setInputValue(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
//                   autoFocus
//                 />
//               )}
//               <button className="chatbot-submit" onClick={handleSubmit}>
//                 Enviar
//               </button>
//             </div>
//             {error && <p className="error-message">{error}</p>}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default Chatbot;
//----------------------FINAL ORIGINAL---------------------------

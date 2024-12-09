import React, { useState } from "react";


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
    const formDataToSend = {
      ...formData,
      vih_diagnostico: formData.vih_diagnostico || "No tengo",
      vih_tratamiento: formData.vih_tratamiento || "No tengo",
    };

    console.log("Form Data to Send: ", formDataToSend);

    const missingFields = Object.keys(formDataToSend).filter(key => !formDataToSend[key].trim() && key !== 'vih_tratamiento' && key !== 'vih_diagnostico');
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
        body: JSON.stringify(formDataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Detalles del error:", errorData);
      }
      console.log("Datos enviados correctamente:", formDataToSend);
    } catch (error) {
      console.error(error);
      alert("Hubo un error al enviar los datos: " + error.message);
    }
  };

  return (
    <div>
      <div>
        {steps.slice(0, currentStep).map((step, index) => (
          <div key={index}>
            <div>{step.question}</div>
            <div>{formData[step.key]}</div>
          </div>
        ))}
        {currentStep < steps.length ? (
          <div>
            <h2>{currentQuestion.question}</h2>
            <div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                autoFocus
              />
              <button onClick={handleSubmit}>Enviar</button>
            </div>
            {error && <p>{error}</p>}
          </div>
        ) : (
          <div>
            <h2>¡Formulario completo!</h2>
            <button onClick={sendForm}>Enviar respuestas</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatbotSanitario;

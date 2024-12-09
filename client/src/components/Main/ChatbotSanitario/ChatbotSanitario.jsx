import { useState } from "react";

const initialData = {
  municipio_residencia: "",
  ccaa: "",
  ambito_laboral: "",
  especialidad: "",
  vih_usuario: "",
  vih_diagnostico: "",
  vih_tratamiento: "",
  ha_tratado_vih: "",
  como_conocio_felgtbi: "",
};

function Chatbot() {
  const [formData, setFormData] = useState(initialData);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  // Definir las preguntas y validaciones
  const steps = [
    {
      key: "municipio_residencia",
      question: "¿Cuál es tu municipio de residencia?",
      validate: (value) => value.trim().length > 0,
      errorMessage: "Por favor, ingresa tu municipio de residencia.",
    },
    {
      key: "ccaa",
      question: "¿Cuál es tu comunidad autónoma?",
      validate: (value) => value.trim().length > 0,
      errorMessage: "Por favor, ingresa tu comunidad autónoma.",
    },
    {
      key: "ambito_laboral",
      question: "¿Cuál es tu ámbito laboral?",
      validate: (value) => value.trim().length > 0,
      errorMessage: "Por favor, especifica tu ámbito laboral.",
    },
    {
      key: "especialidad",
      question: "¿Cuál es tu especialidad?",
      validate: (value) => value.trim().length > 0,
      errorMessage: "Por favor, especifica tu especialidad.",
    },
    {
      key: "vih_usuario",
      question: "¿Eres usuario con vih? (Sí o No)",
      validate: (value) => ["sí", "no"].includes(value.toLowerCase()),
      errorMessage: "Por favor, responde con 'Sí' o 'No'.",
    },
    {
      key: "vih_diagnostico",
      question: "¿Cuál es tu fecha de diagnóstico de vih? (formato: YYYY-MM-DD)",
      validate: (value) => /^\d{4}-\d{2}-\d{2}$/.test(value),
      errorMessage: "Por favor, ingresa una fecha válida (formato: YYYY-MM-DD).",
    },
    {
      key: "vih_tratamiento",
      question: "¿Estás recibiendo tratamiento para el vih? (Sí o No)",
      validate: (value) => ["sí", "no"].includes(value.toLowerCase()),
      errorMessage: "Por favor, responde con 'Sí' o 'No'.",
    },
    {
      key: "ha_tratado_vih",
      question: "¿Has tratado el vih con alguien? (Sí o No)",
      validate: (value) => ["sí", "no"].includes(value.toLowerCase()),
      errorMessage: "Por favor, responde con 'Sí' o 'No'.",
    },
    {
      key: "como_conocio_felgtbi",
      question: "¿Cómo conociste FELGTBI?",
      validate: (value) => value.trim().length > 0,
      errorMessage: "Por favor, especifica cómo conociste FELGTBI.",
    },
  ];

  const currentQuestion = steps[currentStep];

  const handleSubmitAnswer = () => {
    if (currentQuestion.validate(inputValue)) {
      setFormData({ ...formData, [currentQuestion.key]: inputValue });
      setInputValue("");
      setError("");

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setError(currentQuestion.errorMessage);
    }
  };

  const handleSubmitForm = async () => {
    try {
      const response = await fetch("http://52.214.54.221:8000/respuesta-profesional", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al enviar los datos");
      }
      alert("Datos enviados correctamente");
    } catch (error) {
      console.error(error);
      alert("Hubo un error al enviar los datos");
    }
  };

  return (
    <div>
      {currentStep < steps.length ? (
        <div>
          <h2>{currentQuestion.question}</h2>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus
            />
            <button onClick={handleSubmitAnswer}>Enviar</button>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      ) : (
        <div>
          <h2>¡Formulario completo!</h2>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
          <button onClick={handleSubmitForm}>Enviar todo</button>
        </div>
      )}
    </div>
  );
}

export default Chatbot;

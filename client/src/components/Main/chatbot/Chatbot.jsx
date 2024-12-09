import { useState } from "react";

const initialData = {
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

  const steps = [
    {
      key: "edad",
      question: "¿Cuál es tu edad?",
      validate: (value) => /^\d+$/.test(value) && Number(value) > 0,
      errorMessage: "Por favor, ingresa una edad válida (un número positivo).",
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
      errorMessage: "Por favor, especifica tu situación afectiva.",
    },
    {
      key: "tiene_vih",
      question: "¿Tienes vih? (Sí o No)",
      validate: (value) => ["si", "no"].includes(value.toLowerCase()),
      errorMessage: "Por favor, responde con 'Si' o 'No'.",
    },
    {
      key: "fecha_diagnostico",
      question: "¿Cuándo recibiste el diagnóstico?",
      options: ["Menos de un mes", "Entre 1 y 3 meses", "Entre 3 y 12 meses", "Más de un año"],
      validate: (value) => ["menos de un mes", "entre 1 y 3 meses", "entre 3 y 12 meses", "más de un año"].includes(value.toLowerCase()),
      errorMessage: "Por favor, selecciona una opción válida.",
      conditional: (formData) => formData.tiene_vih.toLowerCase() === "si",
    },
    {
      key: "fecha_inicio_tratamiento",
      question: "¿Desde cuándo recibes tratamiento?",
      options: ["Menos de un mes", "Entre 1 y 3 meses", "Entre 3 y 12 meses", "Más de un año"],
      validate: (value) => ["menos de un mes", "entre 1 y 3 meses", "entre 3 y 12 meses", "más de un año"].includes(value.toLowerCase()),
      errorMessage: "Por favor, selecciona una opción válida.",
      conditional: (formData) => formData.tiene_vih.toLowerCase() === "si",
    },
    {
      key: "hablado_con_alguien",
      question: "¿Has hablado con alguien sobre esto? (Sí o No)",
      validate: (value) => ["si", "no"].includes(value.toLowerCase()),
      errorMessage: "Por favor, responde con 'Si' o 'No'.",
    },
    {
      key: "como_conocio_felgtbi",
      question: "¿Cómo conociste FELGTBI?",
      validate: (value) => value.trim().length > 0,
      errorMessage: "Por favor, ingresa cómo conociste FELGTBI.",
    },
  ];

  const currentQuestion = steps[currentStep];

  const handleConditionalSteps = (value) => {
    if (currentQuestion.key === "tiene_vih") {
      if (value.toLowerCase() === "si") {
        setCurrentStep(steps.findIndex((step) => step.key === "fecha_diagnostico"));
      } else {
        setCurrentStep(steps.findIndex((step) => step.key === "como_conocio_felgtbi"));
      }
      return true; // Indica que manejó el salto condicional
    }
    return false;
  };

  const handleSubmitAnswer = () => {
    if (currentQuestion.validate(inputValue)) {
      const updatedValue = currentQuestion.key === "edad" ? Number(inputValue) : inputValue; // Convertir edad a número
      setFormData({ ...formData, [currentQuestion.key]: updatedValue });
      setInputValue("");
      setError("");

      if (!handleConditionalSteps(inputValue)) {
        // Avanzar al siguiente paso o finalizar
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          setCurrentStep(steps.length); // Marcar el formulario como completo
        }
      }
    } else {
      setError(currentQuestion.errorMessage);
    }
  };

  const handleSubmitForm = async () => {
    try {
      const response = await fetch("http://52.214.54.221:8000/respuesta-usuario", {
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
      {/* Renderizado del chat */}
      <div>
        {/* Mostrar todas las preguntas y respuestas previas */}
        {steps.slice(0, currentStep).map((step, index) => (
          <div key={index}>
            <div>{step.question}</div>
            <div>{formData[step.key]}</div>
          </div>
        ))}

        {/* Mostrar la pregunta actual */}
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
            <button onClick={handleSubmitForm}>Enviar respuestas</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chatbot;

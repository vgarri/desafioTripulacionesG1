import React, {useState} from "react";
import axios from "axios";

const ChatbotLLM = () => {
  const data = {
    pregunta_usuario: "Ejemplo de pregunta",
    municipio: "Madrid",
    ccaa: "Comunidad de Madrid",
    conocer_felgtbi: "Sí",
    vih_usuario: "No",
    vih_diagnostico: "Nunca",
    vih_tratamiento: "No",
    us_edad: 30,
    us_pais_origen: "España",
    us_genero: "Masculino",
    us_orientacion: "Heterosexual",
    us_situacion_afectiva: "Soltero",
    us_hablado: "Sí"
};






  const [LLM, setLLM] = useState("");
  const [message, setMessage] = useState("");
  const handleClick = async () => {
    const url = 'http://52.214.54.221:8000/chatbot_usuario'
      try {
          const response = await axios.post(url, data,{
              headers: { "Content-Type": "application/json"}
              })
            setMessage(response.data.respuesta_chat)
            console.log(response.data)
          }



          // const authHeader = response.headers.authorization;
          // axios.defaults.headers.common['Authorization'] = authHeader;
          // setMessage(`Authorisation Header ${authHeader}`);
 catch (error) {
          console.log(error);
      }
  };










  return <>
    <button onClick={handleClick}>LLM</button>
    {LLM != "" ? LLM : message}
  </>;
};

export default ChatbotLLM;

/*import React, { useState } from "react";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";

function App() {
  const [formData, setFormData] = useState({});
  const [isSanitario, setIsSanitario] = useState(false);
console.log(isSanitario);
  const handlePostData = async () => {
    const endpoint = isSanitario
      ? "http://52.214.54.221:8000/chatbot_profesional"
      : "http://52.214.54.221:8000/chatbot_usuario";

    const formattedData = isSanitario
      ? {
          pregunta_profesional: "¿Eres sanitario?",
          municipio: formData["sanitario-1"],
          ccaa: formData["sanitario-3"],
          conocer_felgtbi: formData["sanitario-5"],
          vih_usuario: "N/A", 
          vih_diagnostico: "N/A",
          vih_tratamiento: "N/A",
          pro_ambito: formData["sanitario-4"],
          pro_especialidad: "N/A", 
          pro_vih_profesional: "N/A",
        }

      : {
          pregunta_usuario: "¿Eres sanitario?",
          municipio: formData["general-1"],
          ccaa: formData["general-3"],
          conocer_felgtbi: formData["general-5"],
          vih_usuario: "N/A",
          vih_diagnostico: "N/A",
          vih_tratamiento: "N/A",
          us_edad: formData["general-2"],
          us_pais_origen: formData["general-4"],
          us_genero: formData["general-6"],
          us_orientacion: "N/A",
          us_situacion_afectiva: "N/A",
          us_hablado: "N/A",
        };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error("Error al enviar los datos");
      }

      console.log("Datos enviados correctamente:", formattedData);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };
 

  const steps = [
    {
      id: "1",
      message: "¿Eres sanitario? (Sí o No)",
      trigger: "2",
    },
    {
      id: "2",
      options: [
        {
          value: "Si",
          label: "Sí",
          trigger: "sanitario-1",
          onClick: () => setIsSanitario(true),
        },
        {
          value: "No",
          label: "No",
          trigger: "general-1",
          onClick: () => setIsSanitario(false),
        },
      ],
    },

    // Flujo para sanitarios
    {
      id: "sanitario-1",
      message: "¿Cuál es tu municipio de residencia?",
      trigger: "sanitario-2",
    },
    {
      id: "sanitario-2",
      options: [
        { value: "Madrid", label: "Madrid", trigger: "sanitario-3" },
        { value: "Barcelona", label: "Barcelona", trigger: "sanitario-3" },
        { value: "Valencia", label: "Valencia", trigger: "sanitario-3" },
      ],
    },
    {
      id: "sanitario-3",
      message: "¿Cuál es tu comunidad autónoma?",
      trigger: "sanitario-4",
    },
    {
      id: "sanitario-4",
      options: [
        { value: "Andalucía", label: "Andalucía", trigger: "general-5" },
      { value: "Aragón", label: "Aragón", trigger: "general-5" },
      { value: "Asturias", label: "Asturias", trigger: "general-5" },
      { value: "Cantabria", label: "Cantabria", trigger: "general-5" },
      { value: "Castilla-La Mancha", label: "Castilla-La Mancha", trigger: "general-5" },
      { value: "Castilla y León", label: "Castilla y León", trigger: "general-5" },
      { value: "Cataluña", label: "Cataluña", trigger: "general-5" },
      { value: "Ceuta", label: "Ceuta", trigger: "general-5" },
      { value: "Extremadura", label: "Extremadura", trigger: "general-5" },
      { value: "Galicia", label: "Galicia", trigger: "general-5" },
      { value: "Islas Baleares", label: "Islas Baleares", trigger: "general-5" },
      { value: "Islas Canarias", label: "Islas Canarias", trigger: "general-5" },
      { value: "La Rioja", label: "La Rioja", trigger: "general-5" },
      { value: "Madrid", label: "Madrid", trigger: "general-5" },
      { value: "Melilla", label: "Melilla", trigger: "general-5" },
      { value: "Murcia", label: "Murcia", trigger: "general-5" },
      { value: "Navarra", label: "Navarra", trigger: "general-5" },
      { value: "País Vasco", label: "País Vasco", trigger: "general-5" },
      { value: "Valencia", label: "Valencia", trigger: "sanitario-5" },
      ],
    },
    {
      id: "sanitario-5",
      message: "¿Cómo conociste FELGTBI?",
      trigger: "sanitario-6",
    },

    // Flujo para usuarios generales
    {
      id: "general-1",
      message: "¿Cuál es tu municipio de residencia?",
      trigger: "general-2",
    },
    {
      id: "general-2",
      options: [
        { value: "18-25", label: "18-25", trigger: "general-3" },
        { value: "26-35", label: "26-35", trigger: "general-3" },
        { value: "36+", label: "36+", trigger: "general-3" },
      ],
    },
    {
      id: "general-3",
      message: "¿Cuál es tu comunidad autónoma?",
      trigger: "general-4",
    },
    {
      id: "general-4",
      options: [
        { value: "Andalucía", label: "Andalucía", trigger: "general-5" },
    { value: "Aragón", label: "Aragón", trigger: "general-5" },
    { value: "Asturias", label: "Asturias", trigger: "general-5" },
    { value: "Cantabria", label: "Cantabria", trigger: "general-5" },
    { value: "Castilla-La Mancha", label: "Castilla-La Mancha", trigger: "general-5" },
    { value: "Castilla y León", label: "Castilla y León", trigger: "general-5" },
    { value: "Cataluña", label: "Cataluña", trigger: "general-5" },
    { value: "Ceuta", label: "Ceuta", trigger: "general-5" },
    { value: "Extremadura", label: "Extremadura", trigger: "general-5" },
    { value: "Galicia", label: "Galicia", trigger: "general-5" },
    { value: "Islas Baleares", label: "Islas Baleares", trigger: "general-5" },
    { value: "Islas Canarias", label: "Islas Canarias", trigger: "general-5" },
    { value: "La Rioja", label: "La Rioja", trigger: "general-5" },
    { value: "Madrid", label: "Madrid", trigger: "general-5" },
    { value: "Melilla", label: "Melilla", trigger: "general-5" },
    { value: "Murcia", label: "Murcia", trigger: "general-5" },
    { value: "Navarra", label: "Navarra", trigger: "general-5" },
    { value: "País Vasco", label: "País Vasco", trigger: "general-5" },
    { value: "Valencia", label: "Valencia", trigger: "general-5" },
      ],
    },
    {
      id: "general-5",
      message: "¿Cómo conociste FELGTBI?",
      trigger: "sanitario-6", // Cambiamos el trigger para enlazar con las opciones
    },
    {
      id: "sanitario-6",
      options: [
        { value: "Redes sociales", label: "Redes sociales", trigger: "end" },
        { value: "Amigos", label: "Amigos", trigger: "end" },
        { value: "Otro", label: "Otro", trigger: "end" },
      ],
    },






    
    // Paso final
    {
      id: "end",
      message: "Gracias por responder, estamos guardando tus datos.",
      trigger: async ({ steps }) => {
        const collectedData = Object.fromEntries(
          Object.entries(steps).map(([key, step]) => [key, step.value])
        );
        setFormData(collectedData);
        await handlePostData();
        return "finish";
      },
    },
    {
      id: "finish",
      message: "¡Tus datos han sido enviados con éxito!",
      end: true,
    },
  ];

  const theme = {
    background: "#f5f8fb",
    headerBgColor: "#6c63ff",
    headerFontColor: "#fff",
    headerFontSize: "16px",
    botBubbleColor: "#6c63ff",
    botFontColor: "#fff",
    userBubbleColor: "#fff",
    userFontColor: "#4a4a4a",
  };

  return (
    <ThemeProvider theme={theme}>
      <ChatBot steps={steps} headerTitle="ChatBot FELGTBI+" />
    </ThemeProvider>
  );
}

export default App; */

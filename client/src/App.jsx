// import React from 'react'
// import './App.css'
// import Main from './components/Main/Main'

// function App() {

//   return (
//     <>
//     <Main />
//     </>
//   )
// }

// export default App


// import Bot from "react-simple-chatbot"
// import './App.css'


// function App() {

//   const steps = [
//     {id: "1", message: "Hola, como te llamas?", trigger: "2"},
//     {id: "2", user: true, trigger: "3"},
//     {id: "3", message:"Encantado de conocerte{previousValue}", end: true},
//   ]
//   return (
//     <>
//     <Bot steps={steps} headerTitle="ChatBot FELGTBI+" speechSynthesis={{enable: true}} />
//     </>
//   )
// }

// export default App






//------------------------
// import React, { useState } from "react";
// import ChatBot from "react-simple-chatbot";
// import { ThemeProvider } from "styled-components";

// function App() {
//   const [formData, setFormData] = useState({});

//   const steps = [
//     {
//       id: "1",
//       message: "¿Eres sanitario? (Sí o No)",
//       trigger: "2",
//     },
//     {
//       id: "2",
//       options: [
//         { value: "Si", label: "Sí", trigger: "sanitario-1" },
//         { value: "No", label: "No", trigger: "general-1" },
//       ],
//     },
//     // Preguntas para sanitarios
//     {
//       id: "sanitario-1",
//       message: "¿Cuál es tu municipio de residencia?",
//       trigger: "sanitario-2",
//     },
//     {
//       id: "sanitario-2",
//       options: [
//         { value: "Madrid", label: "Madrid", trigger: "sanitario-3" },
//         { value: "Barcelona", label: "Barcelona", trigger: "sanitario-3" },
//         { value: "Valencia", label: "Valencia", trigger: "sanitario-3" },
//       ],
//     },
//     {
//       id: "sanitario-3",
//       message: "¿Cuál es tu comunidad autónoma?",
//       trigger: "sanitario-4",
//     },
//     {
//       id: "sanitario-4",
//       options: [
//         { value: "Andalucía", label: "Andalucía", trigger: "sanitario-5" },
//         { value: "Cataluña", label: "Cataluña", trigger: "sanitario-5" },
//         { value: "Madrid", label: "Madrid", trigger: "sanitario-5" },
//       ],
//     },
//     {
//       id: "sanitario-5",
//       message: "¿Cómo conociste FELGTBI?",
//       trigger: "sanitario-6",
//     },
//     {
//       id: "sanitario-6",
//       options: [
//         { value: "Redes sociales", label: "Redes sociales", trigger: "end" },
//         { value: "Amigos", label: "Amigos", trigger: "end" },
//         { value: "Otro", label: "Otro", trigger: "end" },
//       ],
//     },

//     // Preguntas generales
//     {
//       id: "general-1",
//       message: "¿Cuál es tu edad?",
//       trigger: "general-2",
//     },
//     {
//       id: "general-2",
//       options: [
//         { value: "18-25", label: "18-25", trigger: "general-3" },
//         { value: "26-35", label: "26-35", trigger: "general-3" },
//         { value: "36+", label: "36+", trigger: "general-3" },
//       ],
//     },
//     {
//       id: "general-3",
//       message: "¿Cuál es tu país de origen?",
//       trigger: "general-4",
//     },
//     {
//       id: "general-4",
//       options: [
//         { value: "España", label: "España", trigger: "general-5" },
//         { value: "México", label: "México", trigger: "general-5" },
//         { value: "Argentina", label: "Argentina", trigger: "general-5" },
//       ],
//     },
//     {
//       id: "general-5",
//       message: "¿Cuál es tu género?",
//       trigger: "general-6",
//     },
//     {
//       id: "general-6",
//       options: [
//         { value: "Masculino", label: "Masculino", trigger: "end" },
//         { value: "Femenino", label: "Femenino", trigger: "end" },
//         { value: "Otro", label: "Otro", trigger: "end" },
//       ],
//     },

//     // Paso final
//     {
//       id: "end",
//       message: "Gracias por responder. Tus datos han sido registrados.",
//       end: true,
//     },
//   ];

//   const theme = {
//     background: "#f5f8fb",
//     headerBgColor: "#6c63ff",
//     headerFontColor: "#fff",
//     headerFontSize: "16px",
//     botBubbleColor: "#6c63ff",
//     botFontColor: "#fff",
//     userBubbleColor: "#fff",
//     userFontColor: "#4a4a4a",
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <ChatBot steps={steps} headerTitle="ChatBot FELGTBI+" />
//     </ThemeProvider>
//   );
// }

// export default App;



// Opcion 1
//-------------------------------
import React, { useState } from "react";
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

export default App;



//---------

// import React, { useState } from "react";
// import ChatBot from "react-simple-chatbot";
// import { ThemeProvider } from "styled-components";

// function App() {
//   const [formData, setFormData] = useState({});
//   const [isSanitario, setIsSanitario] = useState(null);

//   const handlePostData = async () => {
//     const endpoint = isSanitario
//       ? "http://52.214.54.221:8000/chatbot_profesional"
//       : "http://52.214.54.221:8000/chatbot_usuario";

//     const formattedData = isSanitario
//       ? {
//           pregunta_profesional: "¿Eres sanitario?",
//           municipio: formData["sanitario-1"],
//           ccaa: formData["sanitario-3"],
//           conocer_felgtbi: formData["sanitario-5"],
//           vih_usuario: "N/A", // Ajustar según necesidad
//           vih_diagnostico: "N/A",
//           vih_tratamiento: "N/A",
//           pro_ambito: formData["sanitario-4"],
//           pro_especialidad: "N/A", // Ajustar según necesidad
//           pro_vih_profesional: "N/A",
//         }
//       : {
//           pregunta_usuario: "¿Eres sanitario?",
//           municipio: formData["general-1"],
//           ccaa: formData["general-3"],
//           conocer_felgtbi: formData["general-5"],
//           vih_usuario: "N/A",
//           vih_diagnostico: "N/A",
//           vih_tratamiento: "N/A",
//           us_edad: formData["general-2"],
//           us_pais_origen: formData["general-4"],
//           us_genero: formData["general-6"],
//           us_orientacion: "N/A",
//           us_situacion_afectiva: "N/A",
//           us_hablado: "N/A",
//         };

//     try {
//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formattedData),
//       });

//       if (!response.ok) {
//         throw new Error("Error al enviar los datos");
//       }

//       console.log("Datos enviados correctamente:", formattedData);
//     } catch (error) {
//       console.error("Error al enviar los datos:", error);
//     }
//   };
// const steps = [
//   {
//     id: "1",
//     message: "¿Eres sanitario? (Sí o No)",
//     trigger: "2",
//   },
//   {
//     id: "2",
//     options: [
//       {
//         value: "Si",
//         label: "Sí",
//         trigger: "sanitario-1",
//         onClick: () => setIsSanitario(true),
//       },
//       {
//         value: "No",
//         label: "No",
//         trigger: "general-1",
//         onClick: () => setIsSanitario(false),
//       },
//     ],
//   },

//   // Preguntas para sanitarios
//   {
//     id: "sanitario-1",
//     message: "¿Cuál es tu municipio de residencia?",
//     options: [
//       { value: "Madrid", label: "Madrid", trigger: "sanitario-2" },
//       { value: "Barcelona", label: "Barcelona", trigger: "sanitario-2" },
//       { value: "Valencia", label: "Valencia", trigger: "sanitario-2" },
//     ],
//   },
//   {
//     id: "sanitario-2",
//     message: "¿Cuál es tu comunidad autónoma?",
//     options: [
//       { value: "Andalucía", label: "Andalucía", trigger: "sanitario-3" },
//       { value: "Cataluña", label: "Cataluña", trigger: "sanitario-3" },
//       { value: "Madrid", label: "Madrid", trigger: "sanitario-3" },
//     ],
//   },
//   {
//     id: "sanitario-3",
//     message: "¿Cuál es tu ámbito laboral?",
//     options: [
//       { value: "Hospital", label: "Hospital", trigger: "sanitario-4" },
//       { value: "Clínica", label: "Clínica", trigger: "sanitario-4" },
//       { value: "Otro", label: "Otro", trigger: "sanitario-4" },
//     ],
//   },
//   {
//     id: "sanitario-4",
//     message: "¿Cuál es tu especialidad?",
//     options: [
//       { value: "Cardiología", label: "Cardiología", trigger: "sanitario-5" },
//       { value: "Pediatría", label: "Pediatría", trigger: "sanitario-5" },
//       { value: "Otro", label: "Otro", trigger: "sanitario-5" },
//     ],
//   },
//   {
//     id: "sanitario-5",
//     message: "¿Cómo conociste FELGTBI?",
//     options: [
//       { value: "Redes sociales", label: "Redes sociales", trigger: "sanitario-6" },
//       { value: "Amigos", label: "Amigos", trigger: "sanitario-6" },
//       { value: "Otro", label: "Otro", trigger: "sanitario-6" },
//     ],
//   },
//   {
//     id: "sanitario-6",
//     message: "¿Eres usuario con VIH? (Sí o No)",
//     options: [
//       { value: "Sí", label: "Sí", trigger: "sanitario-7" },
//       { value: "No", label: "No", trigger: "sanitario-7" },
//     ],
//   },
//   {
//     id: "sanitario-7",
//     message: "¿Cuál fue tu fecha de diagnóstico de VIH?",
//     options: [
//       { value: "2020", label: "2020", trigger: "sanitario-8" },
//       { value: "2021", label: "2021", trigger: "sanitario-8" },
//       { value: "2022", label: "2022", trigger: "sanitario-8" },
//     ],
//   },
//   {
//     id: "sanitario-8",
//     message: "¿Estás recibiendo tratamiento para el VIH? (Sí o No)",
//     options: [
//       { value: "Sí", label: "Sí", trigger: "sanitario-9" },
//       { value: "No", label: "No", trigger: "sanitario-9" },
//     ],
//   },
//   {
//     id: "sanitario-9",
//     message: "¿Has tratado pacientes con VIH? (Sí o No)",
//     options: [
//       { value: "Sí", label: "Sí", trigger: "end" },
//       { value: "No", label: "No", trigger: "end" },
//     ],
//   },

//   // Preguntas para usuarios generales
//   {
//     id: "general-1",
//     message: "¿Cuál es tu municipio de residencia?",
//     options: [
//       { value: "Madrid", label: "Madrid", trigger: "general-2" },
//       { value: "Barcelona", label: "Barcelona", trigger: "general-2" },
//       { value: "Valencia", label: "Valencia", trigger: "general-2" },
//     ],
//   },
//   {
//     id: "general-2",
//     message: "¿Cuál es tu edad?",
//     options: [
//       { value: "18", label: "18", trigger: "general-3" },
//       { value: "25", label: "25", trigger: "general-3" },
//       { value: "35", label: "35", trigger: "general-3" },
//     ],
//   },
//   {
//     id: "general-3",
//     message: "¿Cuál es tu comunidad autónoma?",
//     options: [
//       { value: "Andalucía", label: "Andalucía", trigger: "general-4" },
//       { value: "Cataluña", label: "Cataluña", trigger: "general-4" },
//       { value: "Madrid", label: "Madrid", trigger: "general-4" },
//     ],
//   },
//   {
//     id: "general-4",
//     message: "¿Eres usuario con VIH? (Sí o No)",
//     options: [
//       { value: "Sí", label: "Sí", trigger: "general-5" },
//       { value: "No", label: "No", trigger: "general-5" },
//     ],
//   },
//   {
//     id: "general-5",
//     message: "¿Cuál es tu situación afectiva actual?",
//     options: [
//       { value: "Soltero", label: "Soltero", trigger: "general-6" },
//       { value: "Casado", label: "Casado", trigger: "general-6" },
//       { value: "En pareja", label: "En pareja", trigger: "general-6" },
//     ],
//   },
//   {
//     id: "general-6",
//     message: "¿Cómo conociste FELGTBI?",
//     options: [
//       { value: "Redes sociales", label: "Redes sociales", trigger: "end" },
//       { value: "Amigos", label: "Amigos", trigger: "end" },
//       { value: "Otro", label: "Otro", trigger: "end" },
//     ],
//   },

//   // Finalización
//   {
//     id: "end",
//     message: "Gracias por responder, estamos guardando tus datos.",
//     trigger: async ({ steps }) => {
//       const collectedData = Object.fromEntries(
//         Object.entries(steps).map(([key, step]) => [key, step.value])
//       );
//       setFormData(collectedData);
//       await handlePostData();
//       return "finish";
//     },
//   },
//   {
//     id: "finish",
//     message: "¡Tus datos han sido enviados con éxito!",
//     end: true,
//   },
// ];
// const theme = {
//       background: "#f5f8fb",
//       headerBgColor: "#6c63ff",
//       headerFontColor: "#fff",
//       headerFontSize: "16px",
//       botBubbleColor: "#6c63ff",
//       botFontColor: "#fff",
//       userBubbleColor: "#fff",
//       userFontColor: "#4a4a4a",
//     };
//   return (
//     <ThemeProvider theme={theme}>
//       <ChatBot steps={steps} headerTitle="ChatBot FELGTBI+" />
//     </ThemeProvider>
//   );
// }

// export default App;
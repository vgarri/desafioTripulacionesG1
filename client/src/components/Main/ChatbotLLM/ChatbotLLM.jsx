import React, {useState, useEffect} from "react";
import axios from "axios";

const ChatbotLLM = ({ data }) => {
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const fetchLLMResponse = async () => {
      try {
        const response = await axios.post("http://52.214.54.221:8000/chatbot_profesional", {
          sessionId: data.id_sesion,
          userData: data,
        });

        if (response.status === 200) {
          setResponse(response.data);
        } else {
          console.error("Error en la respuesta del LLM:", response.statusText);
        }
      } catch (error) {
        console.error("Error al conectar con el LLM:", error);
      }
    };

    if (data) {
      fetchLLMResponse();
    }
  }, [data]);

  return (
    <div className="chatbot-llm-response">
      {response ? (
        <div>
          <h3>Respuesta del LLM:</h3>
          <p>{response.message}</p>
        </div>
      ) : (
        <p>Cargando respuesta del LLM...</p>
      )}
    </div>
  );
};

export default ChatbotLLM;





// const ChatbotLLM = (data) => {
//   // console.log(data)
//   const [usuario, setUsuario] = useState(false);
//   const [sanitario, setSanitario] = useState(false);
//   const [datosHanLlegado, setDatosHanLlegado] = useState(false);
//   const [LLM, setLLM] = useState(false);
//   const [LLMmessage, setLLMmessage] = useState("");
//   const [preguntaUsuario, setPreguntaUsuario] = useState("Ejemplo de pregunta");
  
//   // const {data} = data





//   // comprobamos el objeto inicial para el LLM AHORA MISMO ESTA SOLO PARA USUARIO
//   useEffect(() => {
//     const comprobarData = async () => {
//       if (data.length > 0) {
//       setDatosHanLlegado(true)
//       }
//     };
//     comprobarData();
    
//   }, [data])
//   const data1 = {
//     pregunta_usuario: preguntaUsuario,
//     municipio: "Madrid",
//     ccaa: "Comunidad de Madrid",
//     conocer_felgtbi: "Sí",
//     vih_usuario: "No",
//     vih_diagnostico: "Nunca",
//     vih_tratamiento: "No",
//     us_edad: 30,
//     us_pais_origen: "España",
//     us_genero: "Masculino",
//     us_orientacion: "Heterosexual",
//     us_situacion_afectiva: "Soltero",
//     us_hablado: "Sí"
// };



// //usuario ? url_usuario : 



//   const interaccionLLM = async () => {
//     const url_usuario = 'http://52.214.54.221:8000/chatbot_usuario'
//     const url_sanitario = 'http://52.214.54.221:8000/chatbot_profesional'
//       try {
//           const response = await axios.post(url_usuario, data1,{
//               headers: { "Content-Type": "application/json"}
//               })
//             if (response.status === 200){
//             setLLMmessage(response.data.respuesta_chat);
//             console.log(response.data);
//             }
//           }

//  catch (error) {
//           console.log(error);
//       }
//   };
//    // crear unn estado para manejar cuando llegan los datos como props








//   return <>
 
//  <div className="chat-input">
//   <input className="chatbot-input"
//               type="text"
              
//               onChange={(e) => setPreguntaUsuario(e.target.value)}></input>
// </div>
//               <button onClick={interaccionLLM}>Enviar (LLM)</button>
//     {LLMmessage ? 
//     <div> 
//       {LLMmessage} 
//     </div>
//     : <h3>spinner</h3>}
//   </>;
// };

// export default ChatbotLLM;


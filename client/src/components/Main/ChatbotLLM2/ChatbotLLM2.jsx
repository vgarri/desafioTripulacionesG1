import React, { useState, useEffect } from "react";
import axios from "axios";

const ChatbotLLM2 = (data) => {
  // console.log(data)
  const [usuario, setUsuario] = useState(false);
  const [sanitario, setSanitario] = useState(false);
  const [datosHanLlegado, setDatosHanLlegado] = useState(false);
  const [LLM, setLLM] = useState(false);
  const [LLMmessage, setLLMmessage] = useState("");
  const [preguntaUsuario, setPreguntaUsuario] = useState("Ejemplo de pregunta");
  const [esAbierta, setEsAbierta] = useState(false);
  const [esCerrada, setEsCerrada] = useState(false);
  const [respuestaIterable, setRespuestaIterable] = useState({
    id_sesion: "prueba_raul_limpiador",
    user_input: ""
  })
  const [respuestaLLMIteracion, setRespuestaLLMIteracion] = useState("")//aqui se guarda el mensaje de las iteraciones
  const [userInput, setUserInput] = useState("");
  

  // const {data} = data





  // comprobamos el objeto inicial para el LLM AHORA MISMO ESTA SOLO PARA USUARIO

  const data1 = {
    pregunta_usuario: preguntaUsuario,
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
  const promptLLM = {
    id_sesion: "prueba_raul_limpiador",
    user_input: userInput
  }
  const promptLLMArbol = {
    id_sesion: "prueba_raul_limpiador",
    user_input: userQuestion,
    primera_ejecucion: true,
    final: false,
    dict_preg_resp: "",
    
  }
  // console.log(promptLLM);

  //usuario ? url_usuario : 


// interaccionLLM No hace falta mostrarlo por pantalla. Esta accion solo es la de condicionar el LLM
  const interaccionLLM = async () => {
    const url_usuario = 'https://desafio-final-vqry.onrender.com/chatbot_usuario'
    const url_sanitario = 'https://desafio-final-vqry.onrender.com/chatbot_profesional'
    try {
      const response = await axios.post(url_usuario, data1, {
        headers: { "Content-Type": "application/json" }
      })
      if (response.status === 200) {
        setLLMmessage(response.data.respuesta_chat);
        console.log(response.data);
      }
    }

    catch (error) {
      console.log(error);
    }
  };
  // crear unn estado para manejar cuando llegan los datos como props 

  const interaccionLLMconBucle = async () => {
    const url_llmPromptDecisor = 'https://desafio-final-vqry.onrender.com/prompt_decisor'
    const url_llmPromptDecisorSanitario = 'https://desafio-final-vqry.onrender.com/chatbot_profesional'
    try {
      const response = await axios.post(url_llmPromptDecisor, promptLLM, {
        headers: { "Content-Type": "application/json" }
      })
      if (response.status === 200 && response.data.outpuut.tipo === "abierta") {
        setEsAbierta(true)
        setRespuestaLLMIteracion(response.data.outpuut.message)
        console.log(response.data);
      }
      if (response.status === 200 && response.data.outpuut.tipo === "cerrada") {
        setEsCerrada(true)
        // setRespuestaLLMIteracion(response.data.outpuut.message)
        await interaccionLLMconBucleParaRespuestaCerrada();
      }
    }

    catch (error) {
      console.log(error);
    }
  };
// SI LA PREGUNTA ES CERRADA SIGUIENTE prompt
  const interaccionLLMconBucleParaRespuestaCerrada = async () => {
    const url_llmPromptDecisor2 = 'https://desafio-final-vqry.onrender.com/prompt_decisor'
    const url_llmPromptDecisorSanitario2 = 'https://desafio-final-vqry.onrender.com/chatbot_profesional'
    try {
      const response = await axios.post(url_llmPromptDecisor2, promptLLMArbol, {
        headers: { "Content-Type": "application/json" }
      })
      if (response.status === 200) {
        setRespuestaLLMIteracion(response.data.outpuut.message)
        console.log(response.data);
      }
    }

    catch (error) {
      console.log(error);
    }
  };
  const interaccionLLMconBucleParaRespuestaCerradaPromptArbol = async () => {
    
    const url_llmPromptArbol = 'http://52.214.54.221:8000/prompt_arbol'
    const url_llmPromptDecisorSanitario2 = 'http://52.214.54.221:8000/chatbot_profesional'
    try {
      const response = await axios.post(url_llmPromptArbol, promptLLM2, {
        headers: { "Content-Type": "application/json" }
      })
      if (response.status === 200) {
        setRespuestaLLMIteracion(response.data.outpuut.message)
        setPrimeraEjecucion(false);
        setFinal(true);
        setDict_preg_resp(response.data.outpuut.dict_preg_resp);
        console.log(response.data);
        setIteracion(2)
        console.log(2)
        //await interaccionLLMconBucleParaRespuestaCerrada2();
      }
    }

    catch (error) {
      console.log(error);
    }
  };






  return <>

    <div className="chat-input">
      <input className="chatbot-input"
        type="text"

        onChange={(e) => setUserInput(e.target.value)}></input>
    </div>
    <button onClick={interaccionLLMconBucle}>Enviar (LLM)</button>
    {respuestaLLMIteracion ?
      <div>
        {respuestaLLMIteracion}
      </div>
      : <h3>spinner</h3>}
  </>;
};

export default ChatbotLLM2;


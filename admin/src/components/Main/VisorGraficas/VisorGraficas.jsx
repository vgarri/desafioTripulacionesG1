import React, {useState, useContext} from "react";
import axios from 'axios';
import { adminContext } from "../../../context/adminContext";
import { useNavigate } from "react-router-dom";
import GraficasUsoAplicacion from "./GraficasUsoAplicacion/GraficasUsoAplicacion";

const VisorGraficas = () => {
  const [pantallaGeneral, setPantallaGeneral] = useState(true);
  const [atras, setAtras] = useState(false);
  const [verGraficas, setVerGraficas] = useState(false);
  const [verEstadisticasUso, setVerEstadisticasUso] = useState(false);
  const navigate = useNavigate();
  const { botonPulsado } = useContext(adminContext);
  const renderGraficasUsoAplicacion = () => {
    return <>
    <GraficasUsoAplicacion/>
    </>;
  }

  const handleVerGraficas = () => {
    setVerGraficas(true);
    setPantallaGeneral(false);
    setAtras(false)
  }
  const handleEstadisticasUso = () => {
    setVerEstadisticasUso(true);
    setAtras(false);
  }
  const handleAtras = () => {
    setAtras(true);
    setPantallaGeneral(true);
    setVerEstadisticasUso(false);
  }




  return <>
 { pantallaGeneral ? <section>
    <button onClick={handleVerGraficas}>Ver gráficas de uso del chatbot</button>
  </section>
  : ""}
  {verGraficas ? <section>
    <article>
     { verEstadisticasUso ? <button onClick={handleEstadisticasUso}>Estadísticas de uso</button> : ""}
      { !atras ? <button onClick={handleAtras}>Atrás</button> : ""}
    </article>
    {!atras ? <article>
    {renderGraficasUsoAplicacion()}
    </article> : ""}
    
    
    
    
    </section> : ""}
    </>;
};

export default VisorGraficas;

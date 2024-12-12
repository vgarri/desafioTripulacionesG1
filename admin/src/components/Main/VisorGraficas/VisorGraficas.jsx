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

  const handleIrAGraficasUsuarios = () => {
    navigate("/graficas-usuarios"); // Redirige a la ruta
  };




  return (
    <div className="visor-graficas">
      {pantallaGeneral && (
        <section>
           <div className="botones-iniciales">
  <button onClick={handleVerGraficas}>
    <img 
      src="/bot.jpg" 
      alt="Ver gráficas de uso del chatbot" 
      className="imagen-boton" 
    />
    Ver gráficas de uso del chatbot
  </button>

  <button onClick={handleIrAGraficasUsuarios}>
    <img 
      src="/bot2.jpg" 
      alt="Ir a Gráficas Usuarios" 
      className="imagen-boton" 
    />
    Ir a Gráficas Usuarios
  </button>
</div>
        </section>
      )}
  
      {verGraficas && (
        <section>
          <article>
            {verEstadisticasUso && (
              <button onClick={handleEstadisticasUso}>Estadísticas de uso</button>
            )}
            {!atras && <button onClick={handleAtras}>Atrás</button>}
          </article>
          {!atras && (
            <article>{renderGraficasUsoAplicacion()}</article>
          )}
        </section>
      )}
    </div>
  );  

};

export default VisorGraficas;
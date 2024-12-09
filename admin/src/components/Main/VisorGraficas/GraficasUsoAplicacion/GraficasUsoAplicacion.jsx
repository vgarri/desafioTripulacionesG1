import React from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const GraficasUsoAplicacion = () => {
  




const data = [

  {

    name: "17-25",

    Usuario_apoyo_emocional: 400,

    Usuario_divulgacion: 100,

    Profesional_apoyo_emocional: 200,

    Profesional_divulgacion: 50,

  },

  {

    name: "26-33",

    Usuario_apoyo_emocional: 100,

    Usuario_divulgacion: 30,

    Profesional_apoyo_emocional: 200,

    Profesional_divulgacion: 10,

  },

  {

    name: "34-41",

    Usuario_apoyo_emocional: 75,

    Usuario_divulgacion: 30,

    Profesional_apoyo_emocional: 200,

    Profesional_divulgacion: 10,

  },

  {

    name: "42-49",

    Usuario_apoyo_emocional: 80,

    Usuario_divulgacion: 30,

    Profesional_apoyo_emocional: 200,

    Profesional_divulgacion: 20,

  },

  {

    name: "50-60",

    Usuario_apoyo_emocional: 50,

    Usuario_divulgacion: 30,

    Profesional_apoyo_emocional: 200,

    Profesional_divulgacion: 20,

  },

  {

    name: "Más de 61 ",

    Usuario_apoyo_emocional: 500,

    Usuario_divulgacion: 30,

    Profesional_apoyo_emocional: 200,

    Profesional_divulgacion: 10,

  },

];

  
  return <>
    <p className="tituloGraficas">Motivos de uso del chatbot según edad y tipo de usuario</p>
    <BarChart

      width={500}

      height={300}

      data={data}

      margin={{

        top: 20,

        right: 30,

        left: 20,

        bottom: 5,

      }}

    >

      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="name" />

      <YAxis />

      <Tooltip />

      <Legend />

      <Bar dataKey="Usuario_apoyo_emocional" stackId="a" fill="#e2007e" />

      <Bar dataKey="Usuario_divulgacion" stackId="a" fill="#44bac1" />

      <Bar dataKey="Profesional_apoyo_emocional" stackId="b" fill="#f45540" />

      <Bar dataKey="Profesional_divulgacion" stackId="b" fill="#9c4aa0" />

    </BarChart>

    </>
};

export default GraficasUsoAplicacion;

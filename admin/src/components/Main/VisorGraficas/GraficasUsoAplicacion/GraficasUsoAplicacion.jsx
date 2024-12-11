import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  Treemap,
} from "recharts";

const GraficasUsoAplicacion = () => {
  const dataporcentaje = [
    { name: "Profesionales", value: 150 },
    { name: "Usuarios", value: 1300 },
  ];

  const colores = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

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
      name: "Más de 61",
      Usuario_apoyo_emocional: 500,
      Usuario_divulgacion: 30,
      Profesional_apoyo_emocional: 200,
      Profesional_divulgacion: 10,
    },
  ];

  const dataTreemap = [
    {
      name: "Por un evento de la organización",
      children: [
        { name: "U", size: 100 },
        { name: "P", size: 20 },
      ],
    },
    {
      name: "Por familiares/amigos",
      children: [
        { name: "U", size: 50 },
        { name: "P", size: 10 },
      ],
    },
    {
      name: "Por noticias",
      children: [
        { name: "U", size: 150 },
        { name: "P", size: 100 },
      ],
    },
    {
      name: "Por redes sociales",
      children: [
        { name: "U", size: 800 },
        { name: "P", size: 20 },
      ],
    },
    {
      name: "Otros",
      children: [
        { name: "U", size: 200 },
        { name: "P", size: 0 },
      ],
    },
  ];

  return (
    <div className="graficas-uso-aplicacion">
      <article>
        <h3 className="tituloGraficas">
          Motivos de uso del chatbot según edad y tipo de usuario
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{
              top: 10,
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
            <Line
              type="monotone"
              dataKey="Usuario_apoyo_emocional"
              stroke="#e2007e"
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="Usuario_divulgacion"
              stroke="#44bac1"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="Profesional_apoyo_emocional"
              stroke="#f45540"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="Profesional_divulgacion"
              stroke="#9c4aa0"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </article>
      <article>
        <h3 className="tituloGraficas">% de uso del chatbot por tipo de usuario</h3>
        <PieChart width={730} height={250}>
          <Pie
            data={dataporcentaje}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={(entry) => `${entry.name}: ${entry.value}`}
          >
            {dataporcentaje.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colores[index]} />
            ))}
          </Pie>
        </PieChart>
      </article>
      <article>
        <h3 className="tituloGraficas">Por qué medio conocen FELGTBI+</h3>
        <div style={{ width: "92%", height: 300 }}>
          <ResponsiveContainer>
            <Treemap
              data={dataTreemap}
              dataKey="size"
              ratio={4 / 3}
              stroke="#fff"
              fill="#8884D8"
            />
          </ResponsiveContainer>
        </div>
      </article>
    </div>
  );
};

export default GraficasUsoAplicacion;

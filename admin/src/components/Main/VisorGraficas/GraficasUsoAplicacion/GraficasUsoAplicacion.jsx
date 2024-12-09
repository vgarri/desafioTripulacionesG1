import React from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Treemap
} from "recharts";

const GraficasUsoAplicacion = () => {

  //  useEffect(() => {
  //   // Simula la obtención de datos
  //   setDataporcentaje([
  //     { name: 'A', value: 400 },
  //     { name: 'B', value: 300 },
  //     { name: 'C', value: 300 },
  //     { name: 'D', value: 200 }
  //   ]);
  // }, []);





//----------------------------> Piechart
  const dataporcentaje = [
    {
      name: "Profesionales", value: 150
    },
    {
      name: "Usuarios", value : 1300
    }
  ];
  const colores = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300']
  //-----------------------------> BarChart



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

//------------------------------> Treemap
const dataTreemap = [
  {
    name: 'Por un evento de la organización',
    children: [
      { name: 'U', size: 100 },
      { name: 'P', size: 20 },
    ]
  },
  {
    name: 'Por familiares/amigos',
    children: [
      { name: 'U', size: 50 },
      { name: 'P', size: 10 },
    ]
  },
  {
    name: 'Por noticias',
    children: [
      { name: 'U', size: 150 },
      { name: 'P', size: 100 },
    ]
  },
  {
    name: 'Por redes sociales',
    children: [
      { name: 'U', size: 800 },
      { name: 'P', size: 20 },
    ]
  },
  {
    name: 'Otros',
    children: [
      { name: 'U', size: 200 },
      { name: 'P', size: 0 },
    ]
  }
];





  return <>
    <article>
    <h3 className="tituloGraficas">Motivos de uso del chatbot según edad y tipo de usuario</h3>
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
    </article>
    <article>
    <h3 className="tituloGraficas"> % de uso del chatbot por tipo de usuario</h3>
    
     
    <PieChart width={730} height={250}>
    
      <Pie data={dataporcentaje} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} label={(entry) => `${entry.name}: ${entry.value}`}>
      {dataporcentaje.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colores[index]} />
          ))}
          </Pie>
    </PieChart>
    </article>
    <article>
      <h3>Por qué medio conocen FELGTBI+</h3>
      <ResponsiveContainer>
        <Treemap
          data={dataTreemap}
          dataKey="size"
          ratio={4 / 3}
          stroke="#fff"
          fill="#8884D8"
        >
          {(nodes) =>
            nodes.map((node, index) => (
              <g key={`node-${index}`} transform={`translate(${node.x}, ${node.y})`}>
                <rect
                  width={node.width}
                  height={node.height}
                  fill={node.depth === 1 ? "#82CA9D" : "#FFC658"}
                  stroke="#fff"
                />
                <text
                  x={node.x + node.width / 2}
                  y={node.y + node.height / 2}
                  textAnchor="middle"
                  fill="#000"
                  fontSize={14}
                >
                  {node.data.name}
                </text>
              </g>
            ))
          }
        </Treemap>
      </ResponsiveContainer>
    </article>

  </>
};

export default GraficasUsoAplicacion;

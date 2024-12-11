import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import {
  LineChart,
  Line,
} from 'recharts';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem,
} from '@mui/material';



// Datos para las gráficas existentes
const data1 = [
  { name: 'Heterosexuales', conTratamiento: 100, sinTratamiento: 50, sinVIH: 50 },
  { name: 'Homosexuales', conTratamiento: 150, sinTratamiento: 70, sinVIH: 150 },
  { name: 'Bisexuales', conTratamiento: 300, sinTratamiento: 40, sinVIH: 360 },
  { name: 'Pansexuales', conTratamiento: 200, sinTratamiento: 25, sinVIH: 265 },
  { name: 'Asexuales', conTratamiento: 40, sinTratamiento: 12, sinVIH: 52 },
  { name: 'Demisexuales', conTratamiento: 40, sinTratamiento: 5, sinVIH: 45 },
  { name: 'Otros', conTratamiento: 30, sinTratamiento: 15, sinVIH: 50 },
];

const data2 = [
  { name: 'Cisgénero hombre', tratamiento: 1000, sinTratamiento: 1010, sinVIH: 5000 },
  { name: 'Cisgénero mujer', tratamiento: 200, sinTratamiento: 213, sinVIH: 4000 },
  { name: 'Bigénero', tratamiento: 66, sinTratamiento: 55, sinVIH: 500 },
  { name: 'Agénero', tratamiento: 200, sinTratamiento: 220, sinVIH: 1500 },
  { name: 'Género fluido', tratamiento: 55, sinTratamiento: 65, sinVIH: 200 },
  { name: 'Intergénero', tratamiento: 200, sinTratamiento: 210, sinVIH: 700 },
  { name: 'Pangénero', tratamiento: 100, sinTratamiento: 105, sinVIH: 600 },
  { name: 'No binario', tratamiento: 52, sinTratamiento: 60, sinVIH: 300 },
  { name: 'Transgénero', tratamiento: 54, sinTratamiento: 70, sinVIH: 400 },
  { name: 'Transexual', tratamiento: 100, sinTratamiento: 101, sinVIH: 200 },
  { name: 'Trigénero', tratamiento: 100, sinTratamiento: 500, sinVIH: 600 },
  { name: 'Genderqueer', tratamiento: 22, sinTratamiento: 30, sinVIH: 100 },
  { name: 'Otros', tratamiento: 20, sinTratamiento: 20, sinVIH: 50 },
];

const dataRadar = [
  { subject: 'Heterosexuales', A: 100, B: 50, C: 30 },
  { subject: 'Homosexuales', A: 150, B: 70, C: 60 },
  { subject: 'Bisexuales', A: 300, B: 40, C: 90 },
  { subject: 'Pansexuales', A: 200, B: 25, C: 30 },
  { subject: 'Asexuales', A: 40, B: 12, C: 8 },
];

const dataCommunities = [
  {
    name: 'Andalucía',
    Enero: 0,
    Febrero: 280,
    Marzo: 10,
    Abril: 320,
    Mayo: 20,
    Junio: 290,
    Julio: 330,
    Agosto: 310,
    Septiembre: 35,
    Octubre: 340,
    Noviembre: 31,
    Diciembre: 300,
  },
  {
    name: 'Aragón',
    Enero: 150,
    Febrero: 180,
    Marzo: 170,
    Abril: 160,
    Mayo: 155,
    Junio: 165,
    Julio: 160,
    Agosto: 155,
    Septiembre: 170,
    Octubre: 165,
    Noviembre: 150,
    Diciembre: 140,
  },
  {
    name: 'Cataluña',
    Enero: 300,
    Febrero: 310,
    Marzo: 320,
    Abril: 330,
    Mayo: 340,
    Junio: 350,
    Julio: 360,
    Agosto: 350,
    Septiembre: 340,
    Octubre: 330,
    Noviembre: 320,
    Diciembre: 310,
  },
];

// Lista de meses
const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const GraficasUsuarios = () => {
  const navigate = useNavigate();
  const [atras, setAtras] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState('Andalucía');

  const filteredCommunity = dataCommunities.find(
    (community) => community.name === selectedCommunity
  );

  const formattedData = months.map((month) => ({
    month,
    value: filteredCommunity[month],
  }));

  const handleCommunityChange = (event) => {
    setSelectedCommunity(event.target.value);
  };



  const filteredData = dataCommunities.filter((community) => community.name === selectedCommunity);

  return (
    <div className="graficas-usuarios">
     <button className="boton-atras" onClick={() => navigate('/graficas')}>
    Atrás
  </button>

      <div className="grafica-card">
        <h3>Personas con/sin VIH - Orientación Sexual</h3>
        <div className="grafica-contenedor">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data1}
              margin={{ top: 30, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" height={50} />
              <Bar dataKey="conTratamiento" stackId="a" fill="#ff5722" name="Con tratamiento" />
              <Bar dataKey="sinTratamiento" stackId="a" fill="#d500f9" name="Sin tratamiento" />
              <Bar dataKey="sinVIH" stackId="a" fill="#00bcd4" name="Sin VIH" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grafica-card">
        <h3>Personas con/sin VIH - Identidad de Género</h3>
        <div className="grafica-contenedor">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data2}
              margin={{ top: 30, right: 30, left: 20, bottom: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" height={50} />
              <Bar dataKey="tratamiento" stackId="a" fill="#ff5722" name="Tratamiento" />
              <Bar dataKey="sinTratamiento" stackId="a" fill="#d500f9" name="Sin tratamiento" />
              <Bar dataKey="sinVIH" stackId="a" fill="#00bcd4" name="Sin VIH" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grafica-card">
        <h3>Usuarios con VIH - Situación Afectiva</h3>
        <div className="grafica-contenedor">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius="90%" data={dataRadar}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 400]} />
              <Radar name="Total A" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Radar name="Total B" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
              <Radar name="Total C" dataKey="C" stroke="#ff7300" fill="#ff7300" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      

      <div className="grafica-card">
        <FormControl fullWidth>
          <InputLabel id="community-select-label">
          Comunidad Autónoma
          </InputLabel><br></br>
          <Select
            labelId="community-select-label"
            value={selectedCommunity}
            onChange={handleCommunityChange}
          >
            {dataCommunities.map((community) => (
              <MuiMenuItem key={community.name} value={community.name}>
                {community.name}
              </MuiMenuItem>
            ))}
          </Select>
        </FormControl>
      
        <h3>Persona con VIH y sin tratamiento</h3>
        <div className="grafica-contenedor">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 20, right: 20, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                angle={-45}
                textAnchor="end"
                dy={10}
              />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" height={50} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                name={selectedCommunity}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GraficasUsuarios;
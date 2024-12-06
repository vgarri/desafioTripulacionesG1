const express = require('express');
const cors = require ('cors');
const sequelize = require('./config/db_pqSQL');
require('dotenv').config(); 
const adminModels = require('./models/admin.model');
const adminRoutes = require("./routes/admin.routes");


const app = express() // inicializar servidor con express
const port = 3000;


const morgan = require("./middlewares/morgan")
app.use(morgan(':method :url :status - :response-time ms :body'));
app.use(express.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, 'client/build')));

app.use(adminModels)
app.use('/api/admin', adminRoutes);
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


// const favoriteRoutes = require("./routes/favorite.routes")
// const markerRoutes = require("./routes/marker.routes")

app.use('/api/admin', adminRoutes);
// app.use('/api/marker', markerRoutes);
// app.use('/api/favorites', favoriteRoutes);


(async () => {
    try {
      // Verificar conexión con la base de datos
      await sequelize.authenticate();
      console.log('Conexión establecida con la base de datos.');
  
      // Sincronizar modelos (creará las tablas si no existen)
      await sequelize.sync({ alter: true }); // Usa `force: true` para recrear tablas (solo en desarrollo)
      console.log('Modelos sincronizados con la base de datos.');
  
    
      app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error('Error al conectar con la base de datos:', error.message);
    }
  })();



app.use('*', function(req, res){
    res.status(404).render('error', { statusCode: 400 })
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
});
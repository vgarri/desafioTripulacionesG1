const express = require('express');
const cors = require ('cors');


const app = express() // inicializar servidor con express
const port = 3000;


const morgan = require("./middlewares/morgan")
/* app.use(morgan(':method :url :status - :response-time ms :body'));
app.use(express.urlencoded({ extended: true })); */

// app.use(express.static(path.join(__dirname, 'client/build')));



app.use(express.json());
// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true
// }));


// const userRoutes = require("./routes/user.routes")
// const favoriteRoutes = require("./routes/favorite.routes")
// const markerRoutes = require("./routes/marker.routes")

// app.use('/api/user', userRoutes);
// app.use('/api/marker', markerRoutes);
// app.use('/api/favorites', favoriteRoutes);




// app.use('*', function(req, res){
//     res.status(404).render('error', { statusCode: 400 })
// });

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
});
const pool = require('../config/db_postgreSQL')
const queries = require('../utils/queries.js') // Queries SQL
const bcrypt = require('bcryptjs');


const getAdmin = async () => {
    let client, result;
    try {
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query(queries.getAdmin)
        result = data.rows
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        client.release();
    }
    return result
}
//esta ruta solo se va a usar desde el codigo, para encriptar la pw en el momento de crearla
// const createAdmin = async (admin) => {
//     const { username, email, password } = admin;
//     let client, result; 
//     try {
//         client = await pool.connect(); // Espera a abrir conexion
//         const hashedPassword = password ? await bcrypt.hash(password, 10) : null; // Si hay contraseña, la hasheamos
//         const data = await client.query(queries.createAdmin,[username, email, hashedPassword])
//         result = data.rowCount
//     } catch (err) {
//         console.log(err);
//         throw err;
//     } finally {
//         client.release();
//     }
//     return result
// }

const createAdmin = async (user) => {
    const { username, email, password } = user;
    let client, result;

    // Si el username es null o undefined, asigna uno por defecto
    const finalUsername = username ? username : email.split('@')[0]; 
    try {
        client = await pool.connect(); // Espera a abrir conexion
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null; // Si hay contraseña, la hasheamos
        const data = await client.query(queries.createAdmin,[finalUsername, email, hashedPassword])
        result = data.rowCount
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        client.release();
    }
    return result
}
// GET BY EMAIL CONTROLLER PARAMS
const getAdminByEmail = async (email) => {
    let client, result;
    try {
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query(queries.getAdminByEmail, [email])
        result = data.rows
        
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        client.release();
    }
    return result
}




const login = async (email, password) => {
    let client, result;
    try {
        client = await pool.connect();
        const storedAdmin = await client.query(queries.getAdminByEmail, [email]);
        //console.log(storedUser)
        const comparePW = await bcrypt.compare(password, storedAdmin.rows[0].password); // un-hasheamos contraseña
        if (!comparePW) {
            throw new Error('Incorrect Password');
        }
        else {
        const adminExists = await client.query(queries.login, [email, storedAdmin.rows[0].password]);
        return adminExists;
        }

    } catch (error) {
        console.log(error.message);
        throw error
    };
};

const Admin = {
    getAdmin,
   getAdminByEmail,
   createAdmin,
    login
}

module.exports = Admin;
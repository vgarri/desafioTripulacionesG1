const Admin = require('../models/admin.model.sql.js'); // Importar el modelo de la BBDD


const getAdmin = async (req, res) => {
    let admin;
    admin = await Admin.getAdmin();

    res.status(200).json(admin); // 
}
const getAdminByEmail = async (req, res) => {
    const { email } = req.query;
    try {
        const userData = await Admin.getAdminByEmail(email);
        if (userData) {
            res.status(200).json(userData);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error obtaining user by email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const createAdmin = async (req, res) => {
    try {
 
        const newAdmin = req.body; // {username,email,password}
        const response = await Admin.createAdmin(newAdmin);
        res.status(201).json({
            "items_created": response,
            message: `Admin created: ${req.body.email}`,
            username: newAdmin.username,
            email: newAdmin.email
        })
    } catch (error) {
        console.error('Error creating Admin:', error)


    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await Admin.login(email, password);
        if(response){
            res.status(200).json({
                message: `log in was successful`,
            });
        } else {
            res.status(404).json({ error: 'wrong creadentials' });
        }
  

    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
const logout = async (req, res) => {
    try {
        res.status(200)
    } catch (error) {
        res.status(400).json({ msg: error.message });

    }
};
const testConnection = async (req, res) => {
    let testmessage;
    testmessage =  "connection established";

    res.status(200).json(testmessage); // 
}

module.exports = {
    testConnection,
    getAdmin,
    createAdmin,
    getAdminByEmail,
    login,
    logout
}
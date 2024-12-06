const Admin = require('../models/admin.model'); // Importar el modelo de la BBDD


const getAdmin = async (req, res) => {
    let admin;
    admin = await Admin.getAdmin();

    res.status(200).json(admin); // 
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.login(email, password);
        if (admin) {
 
            res.status(200)
        } else {
            res.status(400).json({ msg: "wrong credentials" });
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
    login,
    logout
}
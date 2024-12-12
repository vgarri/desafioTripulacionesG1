import React, { useState, useEffect } from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  //este useEffect testea la conexión con el Backend y la BBDD:

   useEffect(() => {
    const testConnection = async () => {
      try {
        const request = await axios({
          method: 'get',
          url: 'https://desafiotripulacionesg1.onrender.com/api/admin/test',
          withCredentials: true
        })
        if (request) {
          
          setMessage("connected to server");
          console.log(message)
          setTimeout(() => setMessage(""), 2000);
        };
      } catch (error) {
        console.log(error);
      }
    }
    testConnection();
  }, []) 

const LoginTest = (e) => {
  onLogin();
}



  const handleLogin = async (e) => {
    e.preventDefault();





    try{
        const response = await axios({
          method: 'post',
          url: 'https://desafiotripulacionesg1.onrender.com/api/admin/login',
          data: {email, password},
          withCredentials: true
        });
        if (response.status === 200){
          alert(`admin login was succesful`)
          //actualizar el context y navigate al dashboard
          
        }





    }
    catch (error){
      alert(`wrong credentials`)
    }

  };















  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try{
      const response = await axios({
        method: 'post',
        url: 'https://desafiotripulacionesg1.onrender.com/api/admin/login',
        data: {email, password},
        withCredentials: true
      });
      if (response.status === 200){
        onLogin();
        alert(`inicio de sesión`)
        
        navigate('./graficas')
        //actualizar el context y navigate al dashboard
      }




  }
  catch (error){
    alert(`wrong credentials`)
  }

 
  };

  return (
    <main className="login-container">
      <div className="login">
      <img src="/admin.jpg" alt="Admin Panel" className="login-image" />
        <h1 className="login-title">Panel de Administrador</h1>

        <form className="login-form" onSubmit={handleLogin}>



          <input
            type="email"
            className="login-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="login-input"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-button" type="submit">
            Iniciar sesión
          </button>
        </form>
      </div>

    </main>
  );

};

export default Login;

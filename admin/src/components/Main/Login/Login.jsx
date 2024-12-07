import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState("");
  

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
          console.log()
          setMessage("connected to server");
          setTimeout(() => setMessage(""), 2000);
        };
      } catch (error) {
        console.log(error);
      }
    }
    testConnection();
  }, [])

















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


  return <>
    {/* {message !="" ?  :""} */}
    <h1>Login</h1>
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Iniciar sesión</button>
    </form>
  </>

};

export default Login;

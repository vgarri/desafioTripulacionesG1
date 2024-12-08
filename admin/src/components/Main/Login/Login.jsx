import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <main className="login-container">
      <div className="login">
        <h1 className="login-title">Panel de Administrador</h1>
        <form className="login-form" onSubmit={handleSubmit}>
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

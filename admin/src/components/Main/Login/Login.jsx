import React, { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar el correo
    if (!emailRegex.test(formData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Por favor, ingresa un correo válido.",
      }));
      return;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    }

    // Validar la contraseña
    if (!passwordRegex.test(formData.password)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password:
          "La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número.",
      }));
      return;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    }

    // Si todo está bien, enviar los datos
    console.log("Formulario enviado:", formData);
    alert("Inicio de sesión exitoso");
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {/* Campo de correo */}
        <div>
          <label htmlFor="email">Correo electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p>{errors.email}</p>}
        </div>

        {/* Campo de contraseña */}
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p>{errors.password}</p>}
        </div>

        {/* Botón de envío */}
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
};

export default Login;

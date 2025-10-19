import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Login({ setUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/home");
      } else {
        alert("Invalid credentials. Please sign up.");
        navigate("/signup");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2 className="auth-title">Login</h2>
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
        className="auth-input"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        required
        className="auth-input"
      />
      <button type="submit" className="auth-button">Login</button>
    </form>
  );
}

export default Login;


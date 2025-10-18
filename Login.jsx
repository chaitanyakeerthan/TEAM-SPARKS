import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Login({ setUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json(); // if backend returns user info
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/home");
      } else if (res.status === 404) {
        setError("User not found. Please sign up.");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try later.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        <button type="button" className="secondary" onClick={() => navigate("/signup")}>
          Go to Sign Up
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default Login;


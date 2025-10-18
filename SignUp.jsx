import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function SignUp() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:8080/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess("Sign-up successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else if (res.status === 409) {
        setError("Email already exists. Please login.");
      } else {
        setError("Sign-up failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try later.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
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
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
        <button type="button" className="secondary" onClick={() => navigate("/login")}>
          Back to Login
        </button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
}

export default SignUp;

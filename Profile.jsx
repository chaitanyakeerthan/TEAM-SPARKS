// Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Profile.css";

function Profile({ user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    setFormData({
      name: user.name,
      email: user.email,
      password: "",
    });

    if (user.photoUrl) {
      setPreview(user.photoUrl);
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Update user details
      const res = await fetch(`http://localhost:8080/api/user/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update profile");
      }

      // 2️⃣ Upload profile image if selected
      if (photo) {
        const form = new FormData();
        form.append("photo", photo);

        const photoRes = await fetch(`http://localhost:8080/api/user/${user.id}/upload-photo`, {
          method: "POST",
          body: form,
        });

        if (!photoRes.ok) {
          const errData = await photoRes.json();
          throw new Error(errData.message || "Photo upload failed");
        }

        // Get updated photo URL from backend
        const photoData = await photoRes.json();
        setPreview(photoData.photoUrl);
      }

      // Update localStorage and show message
      const updatedUser = { ...user, ...formData, photoUrl: preview };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <h1>Your Profile</h1>
        {message && <p className="msg">{message}</p>}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="photo-section">
            <img
              src={preview || "/default-profile.png"}
              alt="Profile"
              className="profile-photo"
            />
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
          </div>

          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
            />
          </label>

          <button type="submit" className="btn-submit">Update Profile</button>
        </form>
      </div>
    </div>
  );
}

export default Profile;


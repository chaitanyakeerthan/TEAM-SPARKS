import React, { useState } from "react";
import "./Home.css";
import Navbar from "./Navbar"; // ✅ Navbar added
import { useNavigate } from "react-router-dom";

function Home({ user, photo, setPhoto, weatherData, setWeatherData }) {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFetchData = async () => {
    if (!city.trim()) return setError("Please enter a city.");
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:8080/api/data/combined?city=${encodeURIComponent(
          city
        )}`
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const json = await res.json();
      setWeatherData(json);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch weather. Check backend or city name.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      navigate("/soil-status", { state: { photo: file, city, weatherData } });
    }
  };

  return (
    <div className="home-page">
      {/* ✅ Navbar added */}
      <Navbar />

      <header className="home-hero">
        <div className="hero-content">
          <h1>CropPulse — Smart Farm Assistant 🌾</h1>
          <p className="hero-sub">
            Track weather, get soil insights, and keep your farm healthy. Upload
            a soil or field photo below to analyze vegetation and receive
            nutrient guidance.
          </p>
        </div>

        <div className="hero-actions">
          <div className="city-input">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city (e.g., Hyderabad)"
            />
            <button onClick={handleFetchData} className="btn">
              Get Weather
            </button>
          </div>

          <div className="photo-group">
            <label className="file-label">
              <input type="file" accept="image/*" onChange={handlePhotoInput} />
              <span>Upload / Take Photo</span>
            </label>
            {photo && (
              <div className="photo-preview">
                <img src={URL.createObjectURL(photo)} alt="preview" />
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="home-main">
        <section className="weather-block">
          <h2>Weather Snapshot</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="err">{error}</p>}
          {weatherData?.weather ? (
            <div className="weather-card">
              <div>
                <strong>Temp:</strong> {weatherData.weather.main.temp} °C
              </div>
              <div>
                <strong>Condition:</strong>{" "}
                {weatherData.weather.weather[0].description}
              </div>
              <div>
                <strong>Humidity:</strong> {weatherData.weather.main.humidity} %
              </div>
              <div>
                <strong>Wind:</strong>{" "}
                {weatherData.weather.wind?.speed ?? "N/A"} m/s
              </div>
            </div>
          ) : (
            <p className="muted">
              No weather data. Enter a city and click "Get Weather".
            </p>
          )}
        </section>

        <section className="info-grid">
          <article className="card">
            <h3>Crop Tips 🌱</h3>
            <p>
              Rotate crops and add organic compost to improve soil structure.
              Monitor soil moisture before irrigation.
            </p>
          </article>

          <article className="card">
            <h3>Market Advice 💰</h3>
            <p>
              Sell produce during high-demand seasons. Track cooperative offers
              to maximize returns.
            </p>
          </article>

          <article className="card">
            <h3>Weather Alerts ⚠️</h3>
            <p>
              Stay alert for extreme weather conditions and adjust irrigation or
              fertilization schedules.
            </p>
          </article>
        </section>
      </main>

      <footer className="home-footer">
        <p>
          © 2025 CropPulse | Empowering Farmers with Smart Agriculture Solutions
        </p>
      </footer>
    </div>
  );
}

export default Home;





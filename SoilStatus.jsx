// SoilStatus.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./SoilStatus.css";

function SoilStatus() {
  const location = useLocation();
  const navigate = useNavigate();
  const { photo, city } = location.state || {};

  const [weatherData, setWeatherData] = useState(null);
  const [nutrients, setNutrients] = useState({ N: 0, P: 0, K: 0 });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cart state
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: 1, price: 0 });
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    if (!photo || !city) {
      navigate("/home");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8080/api/data/combined?city=${encodeURIComponent(city)}`
        );
        if (!res.ok) throw new Error("Failed to fetch weather & soil data");
        const data = await res.json();
        setWeatherData(data);

        const soil = data.soil;
        const temp = soil.temperature;
        const humidity = soil.humidity;

        const computedNutrients = computeNutrients(temp, humidity);
        setNutrients(computedNutrients);

        const imageAnalysis = analyzePhoto(photo);
        setAnalysis(imageAnalysis);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [photo, city, navigate]);

  const computeNutrients = (temp, humidity) => {
    let N = Math.max(0, 50 - temp);
    let P = Math.max(0, 30 - humidity);
    let K = Math.max(0, 40 - temp / 2);
    return { N, P, K };
  };

  const analyzePhoto = (imageFile) => {
    return {
      plant: "Wheat",
      health: Math.random() > 0.5 ? "Healthy" : "Needs Attention",
    };
  };

  const handleSubmit = () => {
    alert(
      `Data saved!\nPlant: ${analysis?.plant}\nNutrients: N-${nutrients.N}, P-${nutrients.P}, K-${nutrients.K}`
    );
  };

  // Cart operations
  const addItem = () => {
    if (!newItem.name || !newItem.quantity || !newItem.price) return;
    if (editingItem) {
      setCartItems(cartItems.map(item =>
        item.id === editingItem.id
          ? { ...item, ...newItem, id: editingItem.id }
          : item
      ));
      setEditingItem(null);
    } else {
      const id = Date.now(); // temporary ID
      setCartItems([...cartItems, { ...newItem, id }]);
    }
    setNewItem({ name: "", quantity: 1, price: 0 });
  };

  const editItem = (item) => {
    setEditingItem(item);
    setNewItem({ name: item.name, quantity: item.quantity, price: item.price });
  };

  const deleteItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <div className="soil-page">
      <Navbar />
      <header className="soil-header">
        <div className="header-top">
          <h1>Soil & Plant Status</h1>
          <button onClick={() => setCartOpen(!cartOpen)} className="cart-btn">🛒 Cart ({cartItems.length})</button>
        </div>
        <p>Review weather & soil data, analyze your field photo, and get nutrient guidance automatically.</p>
      </header>

      {cartOpen && (
        <div className="cart-modal">
          <h2>🛒 Farm Cart</h2>
          <div className="cart-form">
            <input
              type="text"
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Qty"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
            />
            <button onClick={addItem}>{editingItem ? "✏️ Update" : "➕ Add"}</button>
          </div>

          <table className="cart-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <button onClick={() => editItem(item)}>✏️</button>
                    <button onClick={() => deleteItem(item.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={() => setCartOpen(false)} className="btn-close">Close</button>
        </div>
      )}

      <main className="soil-main">
        {loading && <p>Loading data...</p>}
        {error && <p className="err">{error}</p>}

        {weatherData && (
          <section className="weather-summary">
            <h2>🌦 Weather & Soil Data</h2>
            <div className="weather-card">
              <div><strong>Temp:</strong> {weatherData.weather.main.temp} °C</div>
              <div><strong>Condition:</strong> {weatherData.weather.weather[0].description}</div>
              <div><strong>Humidity:</strong> {weatherData.weather.main.humidity} %</div>
              <div><strong>Wind:</strong> {weatherData.weather.wind?.speed ?? "N/A"} m/s</div>
              <div><strong>Soil Temp:</strong> {weatherData.soil.temperature} °C</div>
              <div><strong>Soil Humidity:</strong> {weatherData.soil.humidity} %</div>
            </div>
          </section>
        )}

        {photo && (
          <section className="photo-analysis">
            <h2>📸 Uploaded Field Photo</h2>
            <img src={URL.createObjectURL(photo)} alt="Field" className="photo-preview" />
            <p><strong>Plant Detected:</strong> {analysis?.plant}</p>
            <p><strong>Health:</strong> {analysis?.health}</p>
          </section>
        )}

        <section className="farmer-inputs">
          <h2>📝 Recommended Nutrients</h2>
          <div className="nutrient-form">
            <label>Nitrogen (N): {nutrients.N}</label>
            <label>Phosphorus (P): {nutrients.P}</label>
            <label>Potassium (K): {nutrients.K}</label>
          </div>
          <button onClick={handleSubmit} className="btn-submit">Save Data</button>
        </section>
      </main>
    </div>
  );
}

export default SoilStatus;


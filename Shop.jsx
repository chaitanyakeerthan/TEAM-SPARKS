// src/pages/Shop.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Shop() {
  const navigate = useNavigate();
  const [products] = useState([
    { id: 1, name: "Organic Fertilizer", price: 250, img: "https://cdn-icons-png.flaticon.com/512/4264/4264877.png" },
    { id: 2, name: "Wheat Seeds (1kg)", price: 180, img: "https://cdn-icons-png.flaticon.com/512/7662/7662548.png" },
    { id: 3, name: "Pesticide Spray", price: 400, img: "https://cdn-icons-png.flaticon.com/512/3500/3500672.png" },
    { id: 4, name: "Drip Irrigation Kit", price: 1200, img: "https://cdn-icons-png.flaticon.com/512/2972/2972316.png" },
    { id: 5, name: "Tractor Oil", price: 600, img: "https://cdn-icons-png.flaticon.com/512/4862/4862592.png" },
  ]);

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">
        🌾 Farmer Product Store
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg border border-green-200 transition"
          >
            <img src={p.img} alt={p.name} className="w-28 h-28 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-center">{p.name}</h2>
            <p className="text-center text-gray-700 mb-4">₹{p.price}</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => addToCart(p)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Add to Cart
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                View Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

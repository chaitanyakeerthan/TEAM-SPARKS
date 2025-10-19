// src/pages/Checkout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const placeOrder = () => {
    alert("✅ Order placed successfully!");
    localStorage.removeItem("cart");
    navigate("/shop");
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        💳 Checkout
      </h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between mb-2">
              <span>
                {item.name} (x{item.qty})
              </span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}
          <hr className="my-3" />
          <h3 className="text-xl font-bold">Total: ₹{total}</h3>

          <button
            onClick={placeOrder}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}

// src/pages/Cart.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  const updateQty = (id, delta) => {
    const updated = cart.map((item) =>
      item.id === id
        ? { ...item, qty: Math.max(1, item.qty + delta) }
        : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cart.filter((i) => i.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        🧺 Your Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center mt-20 text-gray-500">
          Your cart is empty.<br />
          <button
            onClick={() => navigate("/shop")}
            className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
          >
            Go to Shop
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-100 text-left">
                <th className="p-2 border-b">Item</th>
                <th className="p-2 border-b">Qty</th>
                <th className="p-2 border-b">Price</th>
                <th className="p-2 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2 flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="px-3 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    {item.qty}
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="px-3 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </td>
                  <td className="p-2">₹{item.price * item.qty}</td>
                  <td className="p-2">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right mt-6">
            <h3 className="text-xl font-semibold">Total: ₹{total}</h3>
            <button
              onClick={() => navigate("/checkout")}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


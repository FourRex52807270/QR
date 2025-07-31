import React, { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const InsertProduct = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      setMessage("Code is required.");
      return;
    }

    try {
      await setDoc(doc(db, "products", code), {
        code,
        isScanned: false,
        createdAt: new Date().toISOString()
      });

      setMessage(`Product with code "${code}" inserted successfully.`);
      setCode("");
    } catch (error) {
      console.error("Error inserting product:", error);
      setMessage("Failed to insert product.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-slate-900 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-4">Insert Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter product code"
          className="w-full p-2 bg-slate-800 border border-slate-600 rounded"
        />
        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-700 py-2 px-4 rounded text-white font-semibold"
        >
          Insert Product
        </button>
      </form>
      {message && (
        <p className="mt-4 text-sm text-cyan-400">{message}</p>
      )}
    </div>
  );
};

export default InsertProduct;

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

// Interface untuk mendefinisikan bentuk data form
interface LoginForm {
  email: string;
  pass: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginForm>({ email: "", pass: "" });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.email === "admin" && formData.pass === "admin") {
      alert("Login Berhasil!");
      router.push("/adminDashboard"); 
    } else {
      setError("Email atau password salah!");
    }
  };

  return (
    <div className="w-100 h-85 justify-self-center bg-blue-200 p-10 rounded-md border shadow-md">
      <h2>Login Ke Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <div className="mt-5">
          <label>Email:</label>
          <input 
            type="text" 
            className="w-full h-10 p-5 border rounded-md bg-gray-100"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        <div className="mt-5">
          <label>Password:</label>
          <input 
            type="password" 
            className="w-full h-10 p-5 border rounded-md bg-gray-100 "
            value={formData.pass}
            onChange={(e) => setFormData({...formData, pass: e.target.value})}
            required
          />
        </div>
        
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className=" justify-self-center ">
            <button type="submit" className="mt-5 hover:text-gray-600 cursor-pointer ">
          Sign In
        </button>
        </div>
        
      </form>
    </div>
  );
}
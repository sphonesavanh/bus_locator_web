import React, { useState } from "react";
import busIcon from "@/assets/bus-icon.png";
import useAuth from "../hooks/useAuth"; // Make sure the path is correct
import { useNavigate } from "react-router-dom";

const LogIn: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth(); // Use auth context
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const success = await login(username, password);
      
      if (success) {
        navigate("/dashboard"); // Redirect to dashboard on success
      } else {
        setMessage("Invalid Username or Password ❌");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMessage("❌ " + (error.message || "Login failed."));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--my-color)">
      <div className="flex flex-col items-center space-y-4">
        <img src={busIcon} alt="Bus Icon" className="w-32 h-32 mb-2" />

        <input
          type="text"
          placeholder="ຊື່ຜູ້ໃຊ້ງານ..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-72 px-4 py-2 rounded-md bg-white border-1 border-white shadow-md text-black"
        />

        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="ລະຫັດຜ່ານ..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-72 px-4 py-2 rounded-md bg-white border-1 border-white shadow-md text-black"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-2 flex items-center text-white text-sm"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={!username || !password}
          className="bg-white text-black px-6 py-2 rounded-md hover:bg-gray-200 transition border-1 shadow-md disabled:opacity-50"
        >
          ເຂົ້າລະບົບ
        </button>

        {message && <p className="text-white text-sm">{message}</p>}
      </div>
    </div>
  );
};

export default LogIn;

import React, { useState } from "react";
import Logo from "@/assets/logo-white3.png";
import useAuth from "../hooks/useAuth";
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
    <div className="min-h-screen flex flex-col justify-between bg-(--my-color)">
      {/* Centered Content */}
      <div className="flex flex-1 flex-col justify-center items-center space-y-4">
        <img src={Logo} alt="Logo" className="w-40 h-40 mb-5" />

        <input
          type="text"
          placeholder="ຊື່ຜູ້ໃຊ້ງານ..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-72 px-4 py-2 rounded-md bg-white border-1 border-white shadow-md text-black"
        />

        <div className="relative w-72">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="ລະຫັດຜ່ານ..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-white border-1 border-white shadow-md text-black"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-600 text-sm"
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

      {/* Footer */}
      <p className="text-center text-white text-s mb-2">
        Department of Computer Engineering, Faculty of Engineering, NUOL
      </p>
      <p className="text-center text-white text-xs mb-2">
        Developed by: Phonesavanh CHANSOMPHOU, David PHANTHAVONG
      </p>
    </div>
  );
};

export default LogIn;

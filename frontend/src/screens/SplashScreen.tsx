import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SplashScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/identification");
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center px-8">
      <div className="flex flex-col items-center gap-16 max-w-md w-full">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="60" cy="60" r="55" stroke="#FF5722" strokeWidth="4" />
            <path
              d="M40 60L55 75L80 45"
              stroke="#FF5722"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="text-[#FF5722] uppercase tracking-wide" style={{ fontWeight: 900, fontSize: '2rem' }}>
          REFULINK
        </h1>

        {/* Language Selector */}
        <div className="w-full">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full bg-[#000000] text-[#FFFFFF] border-2 border-[#FF5722] rounded-xl px-6 py-4 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
            style={{ fontWeight: 500 }}
          >
            <option value="en">English</option>
            <option value="sw">Kiswahili</option>
            <option value="ar">العربية (Arabic)</option>
            <option value="so">Soomaali (Somali)</option>
            <option value="fr">Français</option>
          </select>
        </div>

        {/* Get Started Button */}
        <button
          onClick={handleGetStarted}
          className="w-full bg-[#FF5722] text-[#000000] rounded-xl px-8 py-4 uppercase tracking-wide hover:opacity-90 transition-opacity"
          style={{ fontWeight: 700 }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

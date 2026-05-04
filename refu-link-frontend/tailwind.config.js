module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#FFFFFF",
        primary: "#FF5722",
        secondary: "#B0B0B0",
        muted: "#1A1A1A",
        border: "#FF5722",
        card: "#000000",
        destructive: "#d4183d",

        // Shortcut names
        blackdeep: "#000000",
        orangebrand: "#FF5722",
        graysoft: "#B0B0B0",
      },

      borderRadius: {
        sm: "8px",
        md: "10px",
        lg: "12px",
        xl: "16px",
      },

      fontFamily: {
        sans: ["Inter"],
      },

      fontWeight: {
        normal: "400",
        medium: "500",
        bold: "700",
        black: "900",
      },
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#232D3F",
        secondary: "#232D3F",
        tertiary: "#005B41",
        quaternary: "#008170",
        secondaryhover: "#19202e",
        quaternaryhover: "#005e52",
      },
    },
  },
  plugins: [],
};

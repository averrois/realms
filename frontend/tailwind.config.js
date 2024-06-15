/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F0F0F",
        secondary: "#232D3F",
        darkblue: "#2e3b52",
        lightblue: "#465b82",
        tertiary: "#005B41",
        quaternary: "#008170",
        quaternaryhover: "#029c87",
        quaternarydisabled: "#014f45"
      },
    },
  },
  plugins: [],
};

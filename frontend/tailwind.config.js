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
        tertiary: "#874CCC",
        quaternary: "#008170",
        secondaryhover: "#19202e",
        quaternaryhover: "#029c87",
        quaternarydisabled: "#014f45"
      },
    },
  },
  plugins: [],
};

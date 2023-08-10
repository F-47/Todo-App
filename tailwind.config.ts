import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "--clr-BrightBlue": "hsl(220, 98%, 61%)",
        "--clr-LightTheme-VeryLightGray": "hsl(0, 0%, 98%)",
        "--clr-LightTheme-VeryLightGrayishBlue": "hsl(236, 33%, 92%)",
        "--clr-LightTheme-LightGrayishBlue": "hsl(233, 11%, 84%)",
        "--clr-LightTheme-DarkGrayishBlue": "hsl(236, 9%, 61%)",
        "--clr-LightTheme-VeryDarkGrayishBlue": "hsl(235, 19%, 35%)",
        "--clr-DarkTheme-VeryDarkBlue": "hsl(235, 21%, 11%)",
        "--clr-DarkTheme-VeryDarkDesaturatedBlue": "hsl(235, 24%, 19%)",
        "--clr-DarkTheme-LightGrayishBlue": "hsl(234, 39%, 85%)",
        "--clr-DarkTheme-LightGrayishBlueHover": "hsl(236, 33%, 92%)",
        "--clr-DarkTheme-DarkGrayishBlue": "hsl(234, 11%, 52%)",
        "--clr-DarkTheme-VeryDarkGrayishBlue": "hsl(233, 14%, 35%)",
      },
      fontFamily: {
        cfont: ["Josefin Sans", "sans-serif"],
      },
    },
  },
  darkMode: "class",
};
export default config;

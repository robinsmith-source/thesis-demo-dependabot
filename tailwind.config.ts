import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./src/**/*.tsx",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
    darkMode: "class",
  },
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: "#ECFCCE",
            foreground: "#000000",
            primary: {
              "100": "#F6FDE6",
              "200": "#ECFCCE",
              "300": "#DBF7B3",
              "400": "#C9EF9D",
              "500": "#B0E57C",
              "600": "#89C45A",
              "700": "#66A43E",
              "800": "#478427",
              "900": "#316D17",
              DEFAULT: "#B0E57C",
            },
            success: {
              "100": "#D8F4FB",
              "200": "#B2E6F8",
              "300": "#87CCEA",
              "400": "#64ACD5",
              "500": "#3783ba",
              "600": "#28669F",
              "700": "#1B4D85",
              "800": "#11366B",
              "900": "#0A2659",
            },
            warning: {
              "100": "#FEF3CC",
              "200": "#FDE399",
              "300": "#FBCD66",
              "400": "#F7B840",
              "500": "#F29704",
              "600": "#D07902",
              "700": "#AE5E02",
              "800": "#8C4601",
              "900": "#743600",
            },
            danger: {
              "100": "#FFE6D7",
              "200": "#FFC8B0",
              "300": "#FFA288",
              "400": "#FF7F6B",
              "500": "#FF443A",
              "600": "#DB2A30",
              "700": "#B71D2F",
              "800": "#93122C",
              "900": "#7A0B2A",
            },
            secondary: {
              "100": "#FBD5FE",
              "200": "#F2ACFD",
              "300": "#E182F9",
              "400": "#CD62F4",
              "500": "#af31ed",
              "600": "#8923CB",
              "700": "#6718AA",
              "800": "#490F89",
              "900": "#340971",
            },
          },
        },
      },
    }),
  ],
} satisfies Config;

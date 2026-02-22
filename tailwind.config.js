/** @type {import('tailwindcss').Config} */
const config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				brand: {
					50: "#eef2ff",
					100: "#e0e7ff",
					200: "#c7d2fe",
					300: "#a5b4fc",
					400: "#818cf8",
					500: "#6366f1",
					600: "#4f46e5",
					700: "#4338ca",
					800: "#3730a3",
					900: "#312e81",
					950: "#1e1b4b",
				},
				surface: {
					DEFAULT: "rgba(15, 15, 25, 0.8)",
					50: "#0d0d1a",
					100: "#111122",
					200: "#16162a",
					300: "#1c1c35",
					400: "#22223f",
					500: "#2a2a4a",
				},
				accent: {
					cyan: "#22d3ee",
					purple: "#a78bfa",
					pink: "#f472b6",
					emerald: "#34d399",
					amber: "#fbbf24",
				},
			},
			fontFamily: {
				sans: ["Inter", "system-ui", "sans-serif"],
				display: ["Inter", "system-ui", "sans-serif"],
				mono: ["JetBrains Mono", "monospace"],
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
				"mesh-gradient":
					"radial-gradient(at 40% 20%, hsla(252,80%,60%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,80%,56%,0.12) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(339,80%,56%,0.1) 0px, transparent 50%)",
			},
			animation: {
				float: "float 6s ease-in-out infinite",
				"float-slow": "float 8s ease-in-out infinite",
				"float-slower": "float 10s ease-in-out infinite",
				"pulse-glow": "pulse-glow 2s ease-in-out infinite",
				"gradient-x": "gradient-x 15s ease infinite",
				"gradient-y": "gradient-y 15s ease infinite",
				"gradient-xy": "gradient-xy 15s ease infinite",
				shimmer: "shimmer 2s linear infinite",
				"fade-in": "fade-in 0.6s ease-out",
				"fade-in-up": "fade-in-up 0.6s ease-out",
				"fade-in-down": "fade-in-down 0.6s ease-out",
				"scale-in": "scale-in 0.3s ease-out",
				"slide-in-right": "slide-in-right 0.4s ease-out",
				"spin-slow": "spin 20s linear infinite",
				orbit: "orbit 20s linear infinite",
			},
			keyframes: {
				float: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-20px)" },
				},
				"pulse-glow": {
					"0%, 100%": { opacity: 1 },
					"50%": { opacity: 0.5 },
				},
				"gradient-x": {
					"0%, 100%": {
						"background-size": "200% 200%",
						"background-position": "left center",
					},
					"50%": {
						"background-size": "200% 200%",
						"background-position": "right center",
					},
				},
				shimmer: {
					"0%": { transform: "translateX(-100%)" },
					"100%": { transform: "translateX(100%)" },
				},
				"fade-in": {
					"0%": { opacity: 0 },
					"100%": { opacity: 1 },
				},
				"fade-in-up": {
					"0%": { opacity: 0, transform: "translateY(20px)" },
					"100%": { opacity: 1, transform: "translateY(0)" },
				},
				"fade-in-down": {
					"0%": { opacity: 0, transform: "translateY(-20px)" },
					"100%": { opacity: 1, transform: "translateY(0)" },
				},
				"scale-in": {
					"0%": { opacity: 0, transform: "scale(0.95)" },
					"100%": { opacity: 1, transform: "scale(1)" },
				},
				"slide-in-right": {
					"0%": { opacity: 0, transform: "translateX(-20px)" },
					"100%": { opacity: 1, transform: "translateX(0)" },
				},
				orbit: {
					"0%": { transform: "rotate(0deg) translateX(100px) rotate(0deg)" },
					"100%": {
						transform: "rotate(360deg) translateX(100px) rotate(-360deg)",
					},
				},
			},
			boxShadow: {
				"glow-sm": "0 0 15px -3px rgba(99, 102, 241, 0.3)",
				glow: "0 0 30px -5px rgba(99, 102, 241, 0.3)",
				"glow-lg": "0 0 60px -10px rgba(99, 102, 241, 0.35)",
				"glow-cyan": "0 0 30px -5px rgba(34, 211, 238, 0.3)",
				"glow-purple": "0 0 30px -5px rgba(167, 139, 250, 0.3)",
				"inner-glow": "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
			},
			borderRadius: {
				"2xl": "1rem",
				"3xl": "1.5rem",
			},
		},
	},
	plugins: [],
};

module.exports = config;

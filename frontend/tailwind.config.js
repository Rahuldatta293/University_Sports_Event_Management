const defaultTheme = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./app/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				cal: ["var(--font-cal)", ...defaultTheme.fontFamily.sans],
			},
			fontSize: {
				xss: "11px",
				smm: "13px",
			},
		},
	},
	corePlugins: {
		preflight: true,
	},
	important: true,
}

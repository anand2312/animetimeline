module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'media',
	theme: {
		fontFamily: {
			sans: ['PT Sans Narrow', 'sans-serif']
		},
		extend: {}
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: ["night", "lofi"]
	}
};

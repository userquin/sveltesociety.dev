import { workboxTransform } from './workboxTransform.js';

const scope = '/'

const pwaConfiguration = {
	srcDir: 'src',
	filename: 'prompt-sw.ts',
	outDir: './.vercel_build_output/static/',
	strategies: 'injectManifest',
	mode: 'development',
	includeManifestIcons: false,
	scope,
	base: scope,
	manifest: {
		id: scope,
		short_name: 'Svelte Society',
		name: 'Svelte Society',
		start_url: scope,
		scope: scope,
		display: 'standalone',
		theme_color: "#ffffff",
		background_color: "#ffffff",
		icons: [
			{
				src: '/images/pwa-192x192.png',
				sizes: "192x192",
				type: "image/png"
			},
			{
				src: '/images/pwa-512x512.png',
				"sizes": "512x512",
				"type": "image/png"
			},
			{
				src: '/images/logo.svg',
				sizes: '400x400',
				type: 'image/svg',
				purpose: 'any maskable',
			}
		]
	},
	injectManifest: {
		globDirectory: './.vercel_build_output/',
		globPatterns: ['robots.txt', '**/*.{js,css,html,ico,png,jeg,jpeg,webp,svg,woff2,webmanifest}'],
		globIgnores: ['**/prompt-sw*', '**/workbox-*'],
		/** @type {import('workbox-build').ManifestTransform} */
		manifestTransforms: [workboxTransform]
	}
};


export { pwaConfiguration }

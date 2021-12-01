const pwaConfiguration = {
	srcDir: './build',
	outDir: './.svelte-kit/output/client',
	mode: 'development',
	includeManifestIcons: false,
	scope: '/',
	base: '/',
	manifest: {
		short_name: "Svelte Society",
		name: "Svelte Society",
		start_url: "/",
		scope: "/",
		display: "standalone",
		theme_color: "#ffffff",
		background_color: "#ffffff",
		icons: [
			{
				src: "/images/pwa-192x192.png",
				sizes: "192x192",
				type: "image/png"
			},
			{
				src: "/images/pwa-512x512.png",
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
	workbox: {
		mode: 'development',
		navigateFallback: "/",
		globDirectory: './build/',
		globPatterns: ['robots.txt', '**/*.{js,css,html,ico,png,webp,svg,woff2,webmanifest}'],
		globIgnores: [
			'**/custom-worker*', '**/workbox-*'
		],
		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
		manifestTransforms: [async(entries) => {
			// manifest.webmanifest is added always by pwa plugin, so we remove it
			const manifest = entries.filter(({ url }) => url !== 'manifest.webmanifest').map((e) => {
				const url = e.url
				if (url) {
					if (url.endsWith('.html')) {
						if (url === 'index.html') {
							e.url = '/'
							console.log(`${url} => ${e.url}`)
						}
						else {
							e.url = `/${url.substring(0, url.lastIndexOf('/'))}`
							console.log(`${url} => ${e.url}`)
						}
					}
				}

				return e
			})
			return { manifest }
		}]
	}
};


export { pwaConfiguration }

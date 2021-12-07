const scope = '/'

const createRevision = () => {
	let revision
	return () => {
		if (!revision) {
			revision = `${Date.now()}`
		}
		return revision
	}
}

const revision = createRevision()

const pwaConfiguration = {
	srcDir: './.vercel_build_output',
	outDir: './.vercel_build_output/static/',
	mode: 'development',
	includeManifestIcons: false,
	scope,
	base: scope,
	manifest: {
		id: scope,
		useCredentials: true,
		short_name: 'FlightLog',
		name: 'Flight Logging',
		start_url: scope,
		scope: scope,
		display: 'standalone',
		theme_color: "#3050f0",
		background_color: "#ffffff",
		icons: [
			{
				src: 'logo192.png',
				sizes: "192x192",
				type: "image/png"
			},
			{
				src: 'logo512.png',
				"sizes": "512x512",
				"type": "image/png"
			},
			{
				src: 'logo512.png',
				"sizes": "512x512",
				"type": "image/png",
				"purpose": "any maskable"
			}
		]
	},
	workbox: {
		mode: 'development',
		// navigateFallback: scope,
		globDirectory: './.vercel_build_output/',
		globPatterns: ['robots.txt', '**/*.{js,css,html,ico,png,jeg,jpeg,webp,svg,woff2,webmanifest}'],
		globIgnores: [
			'**/sw*', '**/workbox-*'
		],
		/** @type {import('workbox-build').ManifestTransform} */
		manifestTransforms: [async(entries) => {
			const deduplicated = entries.reduce((acc, e) => {
				if (acc.has(e.url)) {
					console.warn(`duplicated entry found, ignoring last one: ${e.url}, [${[acc.get(e.url).revision, e.revision].join(', ')}]`)
				} else {
					acc.set(e.url, e)
				}
				return acc;
			}, new Map());

			const dynamicResources = [
				[/^static\/(.+)$/, ([, m]) => m],
			]
			const manifest = [...deduplicated.values()].map((e) => {
				let m
				for (let i = 0; i < dynamicResources.length; i++) {
					m = e.url.match(dynamicResources[i][0])
					if (m) {
						e.url = dynamicResources[i][1](m)
						if (e.url.endsWith('.html')) {
							if (e.url === 'index.html') {
								e.url = '/'
							} else {
								e.url = e.url.slice(0, e.url.lastIndexOf('/'))
							}
						}
						break
					}
				}
				return e;
			});

			return { manifest };
		}],
		// additionalManifestEntries: ['/', '/about', '/flights', '/circles', '/news'].map((url) => {
		// 	return {
		// 		url,
		// 		revision: revision()
		// 	}
		// }),
		runtimeCaching: [
			{
				handler: 'NetworkFirst',
				urlPattern: /\/*\.json/,
				method: 'GET',
				options: {
					cacheName: 'api-prefetch-cache',
					cacheableResponse: {
						statuses: [0, 200],
					},
				},
			},
			{
				urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
				handler: 'CacheFirst',
				options: {
					cacheName: 'google-fonts-cache',
					expiration: {
						maxEntries: 10,
						maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
					},
					cacheableResponse: {
						statuses: [0, 200],
					},
				},
			},
			{
				urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
				handler: 'CacheFirst',
				options: {
					cacheName: 'gstatic-fonts-cache',
					expiration: {
						maxEntries: 100,
						maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
					},
					cacheableResponse: {
						statuses: [0, 200],
					},
				},
			},
		],
	}
};

export{ pwaConfiguration }

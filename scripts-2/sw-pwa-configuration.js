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
		short_name: 'FlightLog',
		name: 'Flight Logging',
		start_url: scope,
		scope: scope,
		display: 'standalone',
		theme_color: "#3050f0",
		background_color: "#ffffff",
		icons: [
			{
				src: '/logo192.png',
				sizes: "192x192",
				type: "image/png"
			},
			{
				src: '/logo512.png',
				"sizes": "512x512",
				"type": "image/png"
			},
			{
				src: '/logo512.png',
				"sizes": "512x512",
				"type": "image/png",
				"purpose": "any maskable"
			}
		]
	},
	injectManifest: {
		globDirectory: './.vercel_build_output/static/',
		globPatterns: ['robots.txt', '**/*.{js,css,html,ico,png,jeg,jpeg,webp,svg,woff2,woff,json,webmanifest}'],
		globIgnores: ['**/prompt-sw*'],
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

			const manifest = [...deduplicated.values()].map((e) => {
				if (e.url.endsWith('.html')) {
					if (e.url === 'index.html') {
						e.url = '/'
					} else {
						e.url = e.url.slice(0, e.url.lastIndexOf('/'))
					}
				}
				return e;
			});

			return { manifest };
		}],
	}
};

export{ pwaConfiguration }

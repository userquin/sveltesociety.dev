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
	outDir: './.vercel_build_output/static/_app',
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
				src: '/logo192.png',
				sizes: "192x192",
				type: "image/png"
			},
			{
				src: '/logo512.png',
				"sizes": "512x512",
				"type": "image/png"
			}
		]
	},
	workbox: {
		mode: 'development',
		navigateFallback: scope,
		globDirectory: './.vercel_build_output/',
		globPatterns: ['robots.txt', '**/*.{js,css,html,ico,png,webp,svg,woff2,webmanifest}'],
		globIgnores: [
			'**/sw*', '**/workbox-*'
		],
		/** @type {import('workbox-build').ManifestTransform} */
		manifestTransforms: [async(entries) => {
			// map the icons and fonts on `./.vercel_build_output/static/
			const resources = new Map([
				['static/robots.txt', '/robots.txt'],
				['static/logo192.png', '/logo192.png'],
				['static/logo512.png', '/logo512.png'],
				['static/planeworld_plain.svg', '/planeworld_plain.svg'],
			])
			const dynamicResources = [
				[/^static\/_app\/assets\/SyncWorker.(\.[a-f0-9]{8}).js$/, ([, hash]) => `/_app/assets/SyncWorker.${hash}.js`],
			]
			const manifest = entries.map((e) => {
				const entry = resources.get(e.url)
				if (entry) {
					e.url = entry[1]
				}
				else {
					let m
					for (let matcher of dynamicResources) {
						m = e.url.match(matcher[0])
						if (m) {
							e.url = matcher[1](m)
							break
						}
					}
				}
				return e;
			});

			return { manifest };
		}],
		additionalManifestEntries: ['/', '/about', '/flights', '/circles', '/news'].map((url) => {
			return {
				url,
				revision: revision()
			}
		})
	}
};


export { pwaConfiguration }

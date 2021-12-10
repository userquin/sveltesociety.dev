import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

declare let self: ServiceWorkerGlobalScope

self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING')
		self.skipWaiting()
})

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST, {
	ignoreURLParametersMatching: [/.*/]
})

// clean old assets
cleanupOutdatedCaches()

// to allow work offline
registerRoute(new NavigationRoute(createHandlerBoundToURL('/')))

registerRoute(
	({ url }) => url.origin === 'https://fonts.googleapis.com',
	new CacheFirst({
		cacheName: 'google-fonts-cache',
		plugins: [
			new ExpirationPlugin({
				maxEntries: 100,
				maxAgeSeconds: 31536000
			}),
			new CacheableResponsePlugin({
				statuses: [0, 200]
			})
		]
	}),
	'GET'
)

registerRoute(
	({ url }) => url.origin === 'https://fonts.gstatic.com',
	new CacheFirst({
		cacheName: 'gstatic-fonts-cache',
		plugins: [
			new ExpirationPlugin({
				maxEntries: 100,
				maxAgeSeconds: 31536000
			}),
			new CacheableResponsePlugin({
				statuses: [0, 200]
			})
		]
	}),
	'GET'
)

registerRoute(
	({ url }) => url && url.pathname.endsWith('.json'),
	new NetworkFirst({
			cacheName: 'api-prefetch-cache',
			plugins: [
				new CacheableResponsePlugin({
					statuses: [0, 200]
				})
			]
	}),
	'GET'
)

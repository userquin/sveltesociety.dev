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
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
cleanupOutdatedCaches()

// to allow work offline
const circlesHandler = createHandlerBoundToURL('/circles')
const indexHandler = createHandlerBoundToURL('/')

registerRoute(/./, async(options) => {
	const { url } = options
	if (url.pathname && url.pathname.startsWith('/circles'))
		return await circlesHandler(options)

	return await indexHandler(options)
}, 'GET')

registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new CacheFirst({
	"cacheName": "google-fonts-cache",
	plugins: [new ExpirationPlugin({
		maxEntries: 10,
		maxAgeSeconds: 31536000
	}), new CacheableResponsePlugin({
		statuses: [0, 200]
	})]
}), 'GET')

registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new CacheFirst({
	"cacheName": "gstatic-fonts-cache",
	plugins: [new ExpirationPlugin({
		maxEntries: 100,
		maxAgeSeconds: 31536000
	}), new CacheableResponsePlugin({
		statuses: [0, 200]
	})]
}), 'GET')

registerRoute(/\/*\.json/, new NetworkFirst({
	"cacheName": "api-prefetch-cache",
	plugins: [new CacheableResponsePlugin({
		statuses: [0, 200]
	})]
}), 'GET')

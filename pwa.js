import { resolveConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa';
import { pwaConfiguration } from './pwa-configuration.js'
import { copyFileSync } from 'fs';

const webmanifestDestinations = [
	'./.svelte-kit/output/client/',
	'./build/',
]

const swDestinations = [
	'./build/',
]

const buildPwa = async() => {
	// const pwaConfiguration = await buildPwaConfiguration()
	const config = await resolveConfig({ plugins: [VitePWA({ ...pwaConfiguration })] }, 'build', 'production' )
	// when `vite-plugin-pwa` is presented, use it to regenerate SW after rendering
	const pwaPlugin = config.plugins.find(i => i.name === 'vite-plugin-pwa')?.api
	if (pwaPlugin?.generateSW) {
		console.log('Generating PWA...')
		await pwaPlugin.generateSW()
		webmanifestDestinations.forEach(d => {
			copyFileSync('./.svelte-kit/output/client/_app/manifest.webmanifest', `${d}/manifest.webmanifest`)
		})
		// don't copy workbox, svelte kit will copy it
		swDestinations.forEach(d => {
			copyFileSync('./.svelte-kit/output/client/sw.js', `${d}/sw.js`)
		})
		console.log('Generated PWA complete')
	}
}

buildPwa()

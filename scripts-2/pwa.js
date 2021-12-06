import { resolveConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa';
import { pwaConfiguration } from './pwa-configuration.js';
// import { copyFileSync } from 'fs';
//
// const webmanifestDestinations = [
// 	'./.svelte-kit/output/_app/',
// ]

const buildPwa = async() => {
	const config = await resolveConfig({ plugins: [VitePWA({ ...pwaConfiguration })] }, '.vercel_build_output', 'production' )
	// when `vite-plugin-pwa` is present, use it to regenerate SW after rendering
	const pwaPlugin = config.plugins.find(i => i.name === 'vite-plugin-pwa')?.api
	if (pwaPlugin?.generateSW) {
		console.log('Generating PWA...')
		await pwaPlugin.generateSW()
		// webmanifestDestinations.forEach(d => {
		// 	copyFileSync('./.svelte-kit/output/client/_app/manifest.webmanifest', `${d}/manifest.webmanifest`)
		// })
		console.log('Generation of PWA complete')
	}
}

buildPwa()

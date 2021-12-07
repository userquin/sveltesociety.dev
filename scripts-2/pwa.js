import { resolveConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa';
import { pwaConfiguration } from './pwa-configuration.js';
import { copyFileSync } from 'fs';


const buildPwa = async() => {
	const config = await resolveConfig({ plugins: [VitePWA({ ...pwaConfiguration })] }, 'build', 'production' )
	// when `vite-plugin-pwa` is present, use it to regenerate SW after rendering
	const pwaPlugin = config.plugins.find(i => i.name === 'vite-plugin-pwa')?.api
	if (pwaPlugin?.generateSW) {
		copyFileSync('../.vercel_build_output/static/_app/manifest.webmanifest', '../.vercel_build_output/static/manifest.webmanifest')
		console.log('Generating PWA...')
		await pwaPlugin.generateSW()
		console.log('Generation of PWA complete')
	}
}

buildPwa()

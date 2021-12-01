import { resolveConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa';
import { pwaConfiguration } from './pwa-configuration.js'
import { copyFileSync, rmSync } from 'fs';
import fg from 'fast-glob'
import { resolve } from 'path';

const webmanifestDestinations = [
	'./.svelte-kit/output/client/',
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
		// const swStuff = await fg([/^sw*/i, /^workbox-*/i],
		// 	{
		// 		cwd: './build',
		// 		deep: 1,
		// 		onlyFiles: true,
		// 		unique: true,
		// 	})
		// swStuff.forEach(sw => rmSync(sw, { force: true }))
		//const webmanifest = await import('./.svelte-kit/output/client/_app/manifest.webmanifest')
		webmanifestDestinations.forEach(d => {
			copyFileSync('./.svelte-kit/output/client/_app/manifest.webmanifest', `${d}/manifest.webmanifest`)
		})
		console.log('Generated PWA complete')
	}
}

buildPwa()

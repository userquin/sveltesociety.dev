/** @type {import('workbox-build').ManifestTransform} */
const workboxTransform = async(entries) => {
// manifest.webmanifest is added always by pwa plugin, so we remove it.
	// EXCLUDE from the sw precache sw and workbox-*
	const manifest = entries.filter(({ url }) =>
		url !== 'manifest.webmanifest' && url !== 'sw.js' && !url.startsWith('workbox-')
	).map((e) => {
		let url = e.url;
		if (url && url.endsWith('.html')) {
			if (url.startsWith('/')) {
				url = url.slice(1);
			}
			// beware: here we SHOULD replace `/` with `base` to support for example `/app/` directory or server context
			if (url === 'index.html') {
				e.url = '/';
			} else if (url.endsWith('index.html')) {
				e.url = `/${url.substring(0, url.lastIndexOf('/'))}`;
			} else if (url.endsWith('.html')) {
				e.url = `/${url.substring(0, url.length - '.html'.length)}`;
			}
		}

		return e;
	});

	return { manifest };
}

export { workboxTransform }

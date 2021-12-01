import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import { mdsvex, escapeSvelte } from 'mdsvex';
import hljs from 'highlight.js';
import path from 'path';

const extensions = [`.svelte`, '.md', `.mdx`, '.svx'];

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess(),
		mdsvex({
			// Breaks svelte-select when .svelte extension is included
			extensions: extensions.filter((ext) => ext !== '.svelte'),
			layout: {
				eventPage: './src/lib/layouts/EventPage.svelte',
				recipe: './src/lib/layouts/Recipe.svelte',
				recipeCategory: './src/lib/layouts/RecipeCategory.svelte'
			},
			highlight: {
				highlighter: (code) => {
					const highlighted = escapeSvelte(hljs.highlightAuto(code).value);
					return `{@html \`<pre class="hljs"><code>${highlighted}</code></pre>\`}`;
				}
			}
		})
	],
	extensions: extensions,
	kit: {
		adapter: adapter(),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#sveltekit-entry',
		vite: {
			optimizeDeps: {
				// workaround Vite issue to fix highlighting on cheatsheet
				// https://github.com/metonym/svelte-highlight/issues/158
				include: ['highlight.js/lib/core']
			},
			resolve: {
				alias: {
					// these are the aliases and paths to them
					$components: path.resolve('./src/lib/components'),
					$layout: path.resolve('./src/lib/components/layout'),
					$layouts: path.resolve('./src/lib/layouts'),
					$utils: path.resolve('./src/lib/utils'),
					$styles: path.resolve('./src/lib/styles'),
					$stores: path.resolve('./src/lib/stores')
				}
			}
		}
	}
};

export default config;

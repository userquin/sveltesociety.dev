<script>
	// import '../app.css';
	import '$styles/reset.css';
	import '$styles/root.css';
	import '$styles/globals.css';
	import Header from '$layout/Header.svelte';
	import Footer from '$layout/Footer.svelte';
	import metatags from '$lib/stores/metatags';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { browser, dev } from '$app/env';

	let path = $page.path.split('/').toString().replace(',', '');
	if ($page.path === '/') path = 'Home';
	const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

	let ReloadPrompt;
	onMount(async () => {
		!dev && browser && (ReloadPrompt = (await import('$lib/components/ReloadPrompt.svelte')).default);
	})
</script>

<svelte:head>
	{#each Object.entries($metatags) as [property, content]}
		{#if content}
			{#if ['title', 'description', 'image'].includes(property)}
				<meta name={property} {content} />
				<title>{capitalize(path)} - Svelte Society</title>
			{:else}
				<meta {property} {content} />
			{/if}
		{/if}
	{/each}
	{#if (!dev && browser)}
		<link rel="manifest" href="/_app/manifest.webmanifest">
	{/if}
</svelte:head>

<Header />
<main class="container">
	<slot />
</main>
<Footer />

{#if ReloadPrompt}
	<svelte:component this={ReloadPrompt} />
{/if}

<style>
	main {
		padding: var(--s-10) var(--s-5) var(--s-20);
	}

	@media (min-width: 1280px) {
		main {
			padding: var(--s-20) var(--s-5);
		}
	}
</style>

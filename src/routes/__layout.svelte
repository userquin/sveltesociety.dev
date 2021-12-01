<script>
	import '../app.postcss';
	import Header from './_Header/Header.svelte';
	import Footer from './_Footer.svelte';
	import metatags from '$lib/stores/metatags';
	import { onMount } from 'svelte';
	import { browser, dev } from '$app/env';

	let ReloadPrompt;
	onMount(async () => {
		!dev && browser && (ReloadPrompt = (await import('$lib/components/ReloadPrompt/index.svelte')).default)
	})


</script>

<svelte:head>
	{#each Object.entries($metatags) as [property, content]}
		{#if content}
			{#if ['title', 'description', 'image'].includes(property)}
				<meta name={property} {content} />
			{:else}
				<meta {property} {content} />
			{/if}
		{/if}
	{/each}
	<link rel="manifest" href="/_app/manifest.webmanifest">
</svelte:head>

<Header />
<main class="container mx-auto py-10 px-5 lg:py-20">
	<slot />
</main>
<Footer />
{#if ReloadPrompt}
	<svelte:component this={ReloadPrompt}/>
{/if}

<script lang="ts">
	import BookCard from '$lib/components/BookCard.svelte';
	import { addToCart } from '$lib/utils/helpers';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Books - DigiBooks</title>
</svelte:head>

<div class="space-y-8">
	<h1 class="text-content text-3xl font-bold">Explore Our Digital Books</h1>

	{#if data.books && data.books.length > 0}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{#each data.books as book (book.id)}
				<BookCard {book} addToCart={() => addToCart(book)} />
			{/each}
		</div>
	{:else}
		<p class="text-content-muted">No books available at the moment. Please check back later.</p>
	{/if}
</div>
